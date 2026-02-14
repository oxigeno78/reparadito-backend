import { Document } from "mongoose";

export interface BookingSchemaInterface extends Document {
    name: string;
    email: string;
    phone: string;
    service: Service;
    dateReserved: Date;
    status: Status;
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

export enum Status {
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELLED = "CANCELLED",
    DONE = "DONE",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED",
    APPROVED = "APPROVED",
    PROCESSING = "PROCESSING",
    FAILED = "FAILED",
    AVAILABLE = "AVAILABLE",
    CONFIRMED = "CONFIRMED",
    RESERVED = "RESERVED",
    UNAVAILABLE = "UNAVAILABLE"
}

export enum PaymentStatus {
    PENDING = "PENDING",
    REJECTED = "REJECTED",
    APPROVED = "APPROVED"
}

export type Availability = {
  date: string;
  slots: Slot[];
  status?: Status;
  service?: string;
};

export type Slot = {
    time: string;
    available: boolean;
    date: string;
    service?: string;
    status?: Status;
};