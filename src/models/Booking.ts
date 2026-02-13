import { Schema, model } from "mongoose";
import { BookingSchemaInterface, PaymentData, Service, Status } from "../interfaces/booking.interface";

const BookingSchema = new Schema<BookingSchemaInterface>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },

  service: {
    type: String,
    enum: Object.values(Service),
    required: true
  },

  dateReserved: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.PENDING
  },

  payment: {
    type: Object as () => PaymentData,
    required: true
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

BookingSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

BookingSchema.methods.toObject = function() {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default model("Booking", BookingSchema);