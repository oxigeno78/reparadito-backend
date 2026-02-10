import { Router } from "express";
import Booking from "../models/Booking";
import { bookingSchema } from "../validators/booking.schema";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const data = bookingSchema.parse(req.body);

    const exists = await Booking.findOne({
      datetime: data.datetime,
      status: { $ne: "CANCELLED" }
    });

    if (exists) {
      return res.status(409).json({ error: "Slot ocupado" });
    }

    const booking = await Booking.create({
      ...data,
      datetime: new Date(data.datetime)
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