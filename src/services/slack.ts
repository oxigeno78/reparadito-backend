import { BookingModel } from '../models/Booking';
import { config } from '../config/env';

export const slackService = {
  notifyNewBooking: async (booking: BookingModel): Promise<void> => {
    console.log(`Notifying Slack about new booking: ${booking.id}`);
    console.log(`Customer: ${booking.customerName} - Service: ${booking.service}`);
  },
  
  notifyCancellation: async (booking: BookingModel): Promise<void> => {
    console.log(`Notifying Slack about cancellation: ${booking.id}`);
  },
  
  notifyPaymentIssue: async (booking: BookingModel): Promise<void> => {
    console.log(`Notifying Slack about payment issue: ${booking.id}`);
  },
};
