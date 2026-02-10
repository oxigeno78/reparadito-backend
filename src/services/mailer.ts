import { BookingModel } from '../models/Booking';
import { config } from '../config/env';

export const mailerService = {
  sendConfirmation: async (booking: BookingModel): Promise<void> => {
    console.log(`Sending confirmation email to ${booking.customerEmail}`);
    console.log(`Booking details: ${booking.service} on ${booking.date}`);
  },
  
  sendCancellation: async (booking: BookingModel): Promise<void> => {
    console.log(`Sending cancellation email to ${booking.customerEmail}`);
  },
  
  sendReminder: async (booking: BookingModel): Promise<void> => {
    console.log(`Sending reminder email to ${booking.customerEmail}`);
  },
};
