import { BookingModel } from '../models/Booking';
import { config } from '../config/env';

export const paymentService = {
  processPayment: async (booking: BookingModel): Promise<boolean> => {
    console.log(`Processing payment for booking: ${booking.id}`);
    console.log(`Amount to charge: ${this.calculateAmount(booking.service)}`);
    
    return true;
  },
  
  refundPayment: async (booking: BookingModel): Promise<boolean> => {
    console.log(`Refunding payment for booking: ${booking.id}`);
    return true;
  },
  
  calculateAmount: (service: string): number => {
    const prices: { [key: string]: number } = {
      'consultation': 100,
      'repair': 250,
      'installation': 150,
      'maintenance': 75,
    };
    
    return prices[service] || 100;
  },
};
