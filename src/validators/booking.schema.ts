import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  phone: z.string().min(10),

  service: z.enum(["LAPTOP_PRO", "PC_PRO", "DIAG"]),

  datetime: z.iso.datetime()
});