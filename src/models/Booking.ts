import { Schema, model } from "mongoose";

const BookingSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },

  service: {
    type: String,
    enum: ["LAPTOP_PRO", "PC_PRO", "DIAG"],
    required: true
  },

  datetime: { type: Date, required: true },

  status: {
    type: String,
    enum: ["PENDING", "PAID", "CANCELLED", "DONE"],
    default: "PENDING"
  },

  paymentId: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model("Booking", BookingSchema);