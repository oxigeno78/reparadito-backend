import { BookingSchemaInterface } from '../interfaces/booking.interface';
import { config } from '../config/env';

export const slackService = {
  notifyNewBooking: async (booking: BookingSchemaInterface): Promise<void> => {
    console.log(`Notifying Slack about new booking: ${booking._id}`);
    console.log(`Customer: ${booking.name} - Service: ${booking.service}`);
  },
  
  notifyCancellation: async (booking: BookingSchemaInterface): Promise<void> => {
    console.log(`Notifying Slack about cancellation: ${booking._id}`);
  },
  
  notifyPaymentIssue: async (booking: BookingSchemaInterface): Promise<void> => {
    console.log(`Notifying Slack about payment issue: ${booking._id}`);
  },
};
