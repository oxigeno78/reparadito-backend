import { z } from "zod";
import { Service } from "../interfaces/booking.interface";

export const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().min(10),

  service: z.enum(Object.values(Service)),

  dateReserved: z.iso.datetime(),

  price: z.number()
});