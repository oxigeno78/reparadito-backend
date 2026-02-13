import { Router } from "express";
import Booking from "../models/Booking";
import { bookingSchema } from "../validators/booking.schema";
import { Status, Availability, Slot, PaymentStatus } from "../interfaces/booking.interface";
import { formatDate } from "../utils/dateFormatter";
import { DAILY_SLOTS } from "../config/slots";
import { Preference } from "mercadopago";
import mp from "../config/mp";
import dayjs from "dayjs";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const filters: Record<string, any> = {
      status: { $ne: Status.CANCELLED },
      dateReserved: {
        $gte: new Date(),
        $lte: new Date(dayjs().add(4, "week").endOf("day").toDate())
      }
    };
    const bookings = await Booking.find(filters).select("dateReserved service status");
    console.log("Bookings:", JSON.stringify(bookings, null, 2));

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
        const slotHour = parseInt(time);
        const occupied = dayBookings.some(b => dayjs(b.dateReserved).hour() === slotHour);
        const service = dayBookings.find(b => {
          console.log('date', dayjs(b.dateReserved).format("YYYY-MM-DD"), 'hour', dayjs(b.dateReserved).hour(), 'slotHour', slotHour, dayjs(b.dateReserved).hour() === slotHour && b.service)
          return dayjs(b.dateReserved).hour() === slotHour
        })?.service;
        //console.log(i, time, date, slotHour, occupied, service)
        return {
          time,
          available: !occupied,
          date,
          service
        };
      });

      // Status general del día
      const dayStatus = dayBookings.some(b => b.available );

      let status = Status.AVAILABLE;
      if (dayStatus) status = Status.AVAILABLE;

      response.push({
        date,
        slots,
        status
      });
    }

    // Ordenar por fecha
    response.sort((a, b) => a.date.localeCompare(b.date));

    console.log("Response:\n", JSON.stringify(response, null, 2));

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
      status: { $ne: Status.CANCELLED }
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
      dateReserved: data.dateReserved,
      status: Status.RESERVED,
      //paymentStatus: PaymentStatus.PENDING,
      payment: {
        preferenceId: "",
        paymentId: "",
        status: PaymentStatus.PENDING,
        paymentAt: null
      },
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutos
    });

    // 2️⃣ Crear preference
    const preference = new Preference(mp);

    const preferenceResult = await preference.create({
      body: {
        items: [
          {
            id: booking._id.toString(),
            title: `Anticipo servicio ${data.service}`,
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
        external_reference: booking._id.toString()
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


    res.status(201).json({
      _id: booking._id,
      status: booking.status,
      message: "Reserva creada",
      init_point: preferenceResult.init_point,
      error: null
    });

  } catch (err: any) {
    return res.status(400).json({
      error: err.message,
      status: 400,
      _id: null,
      message: "Error al crear la reserva"
    });
  }
});

export default router;