import { Router } from "express";
import Booking from "../models/Booking";
import { bookingSchema } from "../validators/booking.schema";
import { BookingStatus, Availability, Slot, PaymentStatus, Service } from "../interfaces/booking.interface";
import { formatDate } from "../utils/dateFormatter";
import { DAILY_SLOTS } from "../config/slots";
import { Preference } from "mercadopago";
import mp from "../config/mp";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { mailService } from "../services/mail";
import { notifySlack } from "../services/slack.service";
import { renderEmailTemplate } from "../utils/renderEmailTemplates";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Etc/GMT+6");

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const filters: Record<string, any> = {
      status: { $in: [BookingStatus.RESERVED, BookingStatus.PROCESSING, BookingStatus.CONFIRMED] },
      dateReserved: {
        $gte: new Date(),
        $lte: new Date(dayjs().add(4, "week").endOf("day").toDate())
      }
    };
    const bookings = await Booking.find(filters).select("dateReserved service bookingStatus");

    // Mapa: fecha => bookings
    const grouped = new Map<string, any[]>();
    for (const booking of bookings) {
      const dateKey = formatDate(booking.dateReserved);
      if (!grouped.has(dateKey)) grouped.set(dateKey, []);
      grouped.get(dateKey)!.push(booking);
    }

    const response: Availability[] = [];
    for (const [date, dayBookings] of grouped) {
      const slots: Slot[] = DAILY_SLOTS.map((time, i) => {
        const slotHour = parseInt(time.split(":")[0], 10);
        const matched = dayBookings.filter(b => dayjs.tz(b.dateReserved).hour() === slotHour);
        const occupied = matched.length > 0;
        const service = matched.map(b => b.service)[0];
        const status = matched.map(b => b.bookingStatus)[0];
        return {
          time,
          available: !occupied,
          date,
          service,
          status
        };
      });

      // Status general del día
      const status = slots.some(slot => slot.status !== BookingStatus.CONFIRMED) ? BookingStatus.AVAILABLE : BookingStatus.UNAVAILABLE;

      response.push({
        date,
        slots,
        status
      });
    }

    // Ordenar por fecha
    response.sort((a, b) => a.date.localeCompare(b.date));

    // console.log("Response:\n", JSON.stringify(response, null, 2));

    res.json(response);

  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: err.message,
      status: 500,
      message: "Error al obtener las reservas"
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = bookingSchema.parse(req.body);

    const exists = await Booking.findOne({
      dateReserved: data.dateReserved,
      bookingStatus: { $in: [BookingStatus.CANCELLED, BookingStatus.CANCELLED_LATE, BookingStatus.NO_SHOW] }
    });

    if (exists) {
      return res.status(409).json({
        error: "Slot ocupado",
        status: 409,
        _id: null,
        message: "Slot ocupado"
      });
    }

    // 1️⃣ Crear booking
    const booking = await Booking.create({
      name: data.clientname,
      email: data.email,
      phone: data.phone,
      service: data.service,
      description: data.description,
      dateReserved: data.dateReserved,
      bookingStatus: BookingStatus.PENDING,
      payment: {
        preferenceId: "",
        paymentId: "",
        status: PaymentStatus.PENDING,
        paymentAt: null
      },
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
    });

    // 2️⃣ Crear preference
    const pymentExpirationDate = new Date(Date.now() + 30 * 60 * 1000); //30 minutos
    const preference = new Preference(mp);
    const serviceName = data.service == Service.DIAG ? 'Diagnóstico a Domicilio' : 'Servicios Informáticos a Domicilio';
    const preferenceResult = await preference.create({
      body: {
        items: [
          {
            id: booking._id.toString(),
            title: `${serviceName} (${data.service})`,
            quantity: 1,
            unit_price: 200, // anticipo
            currency_id: 'MXN'
          }
        ],
        payer: {
          email: data.email
        },
        back_urls: {
          success: 'https://reparadito.nizerapp.net/pago-exitoso',
          failure: 'https://reparadito.nizerapp.net/pago-error',
          pending: 'https://reparadito.nizerapp.net/pago-pendiente'
        },
        auto_return: 'approved',
        notification_url: 'https://reparaditoapi.nizerapp.net/api/webhooks/mp',
        external_reference: booking._id.toString(),
        date_of_expiration: pymentExpirationDate.toISOString()
      }
    });

    // 3️⃣ Guardar preferenceId
    await Booking.findByIdAndUpdate(
      booking._id,
      {
        payment: {
          ...booking.payment,
          preferenceId: preferenceResult.id
        }
      }
    );

    const html = renderEmailTemplate("complatePaymentClient.html", {
      name: booking.name,
      date: dayjs(booking.dateReserved).format("DD/MM/YYYY HH:mm"),
      service: booking.service,
      payment_url: preferenceResult.init_point || '',
      expiration_date: dayjs(pymentExpirationDate).format("DD/MM/YYYY HH:mm")
    });

    await mailService.send({
      to: booking.email,
      subject: "Confirmación de tu cita",
      html: html
    });

    await notifySlack(`📌 Nueva cita Creada: \n\t\tCliente: ${booking.name}\n\t\tEmail: ${booking.email}\n\t\tFecha: ${dayjs(booking.dateReserved).format("DD/MM/YYYY HH:mm")} \n\t\tServicio: ${booking.service}\n📢`);

    res.status(201).json({
      _id: booking._id,
      status: booking.bookingStatus,
      message: "Reserva creada",
      init_point: preferenceResult.init_point,
      error: null
    });

  } catch (err: any) {
    console.log(req.body);
    console.error(err);
    return res.status(400).json({
      error: err.message,
      status: 400,
      _id: null,
      message: "Error al crear la reserva"
    });
  }
});

export default router;