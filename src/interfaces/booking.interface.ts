import { Document } from "mongoose";

export interface BookingSchemaInterface extends Document {
    name: string;
    email: string;
    phone: string;
    service: Service;
    dateReserved: Date;
    status: Status;
    preferenceId?: string;
    paymentId?: string;
    paymentAt?: Date;
    price?: number;
    createdAt?: Date;
    updatedAt?: Date;
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
    FAILED = "FAILED"
}

