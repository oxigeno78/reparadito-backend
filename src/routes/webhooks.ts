import express from "express";
import crypto from "crypto";
import { Payment } from "mercadopago";
import mp from "../config/mp";
import Booking from "../models/Booking";
import { Status, PaymentStatus, PaymentData } from "../interfaces/booking.interface";
const router = express.Router();
const paymentClient = new Payment(mp);

router.post("/mp", async (req, res) => {
    try {
        const signature = req.headers["x-signature"] as string;
        const requestId = req.headers["x-request-id"] as string;
        if (!signature || !requestId) {
            return res.sendStatus(401);
        }
        // 🔐 Validar firma
        const parts = signature.split(",");
        const ts = parts.find(p => p.startsWith("ts="))?.split("=")[1];
        const v1 = parts.find(p => p.startsWith("v1="))?.split("=")[1];
        const now = Date.now() / 1000;
        if (Math.abs(now - Number(ts)) > 300) {
            return res.sendStatus(401);
        }
        const manifest = `id:${requestId};ts:${ts};`;
        const hmac = crypto
            .createHmac("sha256", process.env.MP_WEBHOOK_SECRET!)
            .update(manifest)
            .digest("hex");

        if (hmac !== v1) {
            console.error("Firma inválida MP");
            return res.sendStatus(401);
        }
        // 📦 Data
        const { data, type } = req.body;
        if (type !== "payment") {
            return res.sendStatus(200);
        }
        // 1️⃣ Consultar pago real
        const payment = await paymentClient.get({ id: data.id });
        console.log("Payment:\n", JSON.stringify(payment, null, 2));
        // 2️⃣ Obtener booking
        const bookingId = payment.external_reference;
        if (!bookingId) return res.sendStatus(200);
        // 3️⃣ Idempotencia: ya procesado?
        const existing = await Booking.findOne({ _id: bookingId });
        if (!existing) return res.sendStatus(200);
        if (existing.payment.status === PaymentStatus.APPROVED) return res.sendStatus(200);
        // 4️⃣ Validar estado
        if (payment.status !== "approved") {
            await Booking.findByIdAndUpdate(payment.external_reference, {
                payment: {
                    ...existing.payment,
                    status: payment.status
                }
            });
            return res.sendStatus(200);
        }
        // 5️⃣ Actualizar reserva
        await Booking.findByIdAndUpdate(bookingId, {
            payment: {
                ...existing.payment,
                paymentId: payment.id,
                status: PaymentStatus.APPROVED,
                paymentAt: new Date()
            },
            status: Status.CONFIRMED
        });
        console.log("Pago confirmado:", bookingId);
        res.sendStatus(200);
    } catch (err) {
        console.error("Webhook error:", err);
        res.sendStatus(500);
    }
});

export default router;