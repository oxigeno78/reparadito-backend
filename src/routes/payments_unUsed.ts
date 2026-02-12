import { Router } from 'express';
import { Preference } from 'mercadopago';
import mp from '../config/mp';
import Booking from '../models/Booking';
import { BookingSchemaInterface } from '../interfaces/booking.interface';
import { Status } from '../interfaces/booking.interface';
import rateLimit from 'express-rate-limit';
const router = Router();

/**
 * Crear pago
 */
router.post('/create', rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }), async (req, res) => {
    try {

        const { bookingId, price, customerEmail } = req.body;

        if (!bookingId || !price) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        const booking: BookingSchemaInterface | null = await Booking.findOne({ _id: bookingId });
        if (!booking) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        if (booking.status !== Status.PENDING) {
            return res.status(400).json({ error: 'Reserva ya tiene un proceso de pago activo' });
        }

        if (booking.price !== price) {
            return res.status(400).json({ error: 'Precio no coincide' });
        }

        const preference = new Preference(mp);

        const preferenceResult = await preference.create({
            body: {
                items: [
                    {
                        id: bookingId,
                        title: 'Mantenimiento preventivo PC/Laptop',
                        quantity: 1,
                        unit_price: Number(price),
                        currency_id: 'MXN'
                    }
                ],

                payer: {
                    email: customerEmail
                },

                back_urls: {
                    success: 'https://reparadito.nizerapp.net/pago-exitoso',
                    failure: 'https://reparadito.nizerapp.net/pago-error',
                    pending: 'https://reparadito.nizerapp.net/pago-pendiente'
                },

                auto_return: 'approved',

                notification_url:
                    'https://api.reparadito.nizerapp.net/api/webhooks/mp',

                external_reference: bookingId
            }
        });
        console.log('result', preferenceResult);
        const updateBooking: BookingSchemaInterface | null = await Booking.findOneAndUpdate({ _id: bookingId, status: Status.PENDING }, {
            preferenceId: preferenceResult.id,
            status: Status.PROCESSING,
        },
            { new: true });
        if (!updateBooking) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.json({
            id: preferenceResult.id,
            init_point: preferenceResult.init_point
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Error creando pago'
        });
    }
});

export default router;