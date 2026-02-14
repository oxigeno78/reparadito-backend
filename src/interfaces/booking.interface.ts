import { Document } from "mongoose";

export interface BookingSchemaInterface extends Document {
    name: string;
    email: string;
    phone: string;
    service: Service;
    dateReserved: Date;
    bookingStatus: BookingStatus;
    payment: PaymentData;
    price?: number;
    expiresAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PaymentData {
    preferenceId: string;
    paymentId: string;
    status: PaymentStatus;
    paymentAt: Date | null;
}

export enum Service {
    LAPTOP_PRO = "LAPTOP_PRO",
    PC_PRO = "PC_PRO",
    DIAG = "DIAG"
}

export enum BookingStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELLED = "CANCELLED",
    CANCELLED_LATE = "CANCELLED_LATE",
    DONE = "DONE",
    NO_SHOW = "NO_SHOW",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED",
    APPROVED = "APPROVED",
    PROCESSING = "PROCESSING",
    FAILED = "FAILED",
    AVAILABLE = "AVAILABLE",
    CONFIRMED = "CONFIRMED",
    RESERVED = "RESERVED",
    REESCHEDULED = "REESCHEDULED",
    UNAVAILABLE = "UNAVAILABLE"
}

export enum PaymentStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    REFUNDED = "REFUNDED"
}

export type Availability = {
  date: string;
  slots: Slot[];
  status?: BookingStatus;
  service?: string;
};

export type Slot = {
    time: string;
    available: boolean;
    date: string;
    service?: string;
    status?: BookingStatus;
};