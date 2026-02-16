import { z } from "zod";
import { Service } from "../interfaces/booking.interface";

export const bookingSchema = z.object({
  clientname: z.string().min(3),
  email: z.email(),
  phone: z.string().min(10),

  service: z.enum(Object.values(Service)),
  description: z.string(),
  dateReserved: z.iso.datetime(),

  accept: z.boolean()
});