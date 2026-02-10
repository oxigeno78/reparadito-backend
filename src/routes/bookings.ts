import { Router } from "express";
import Booking from "../models/Booking";
import { bookingSchema } from "../validators/booking.schema";
import { Status } from "../interfaces/booking.interface";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const data = bookingSchema.parse(req.body);

    const exists = await Booking.findOne({
      dateReserved: data.dateReserved,
      status: { $ne: Status.CANCELLED }
    });

    if (exists) {
      return res.status(409).json({ error: "Slot ocupado" });
    }

    const booking = await Booking.create({
      ...data,
      status: Status.PENDING
    });

    // TODO: crear link de pago

    res.status(201).json({
      id: booking._id,
      status: booking.status
    });

  } catch (err: any) {
    return res.status(400).json({
      error: err.message
    });
  }
});

export default router;