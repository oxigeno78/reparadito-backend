import { BookingSchemaInterface } from '../interfaces/booking.interface';
import { config } from '../config/env';

export const mailerService = {
  sendConfirmation: async (booking: BookingSchemaInterface): Promise<void> => {
    console.log(`Sending confirmation email to ${booking.email}`);
    console.log(`Booking details: ${booking.service} on ${booking.dateReserved}`);
  },
  
  sendCancellation: async (booking: BookingSchemaInterface): Promise<void> => {
    console.log(`Sending cancellation email to ${booking.email}`);
  },
  
  sendReminder: async (booking: BookingSchemaInterface): Promise<void> => {
    console.log(`Sending reminder email to ${booking.email}`);
  },
};
