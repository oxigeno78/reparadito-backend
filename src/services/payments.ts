import { BookingSchemaInterface } from '../interfaces/booking.interface';
import { config } from '../config/env';

export const paymentService = {
  processPayment: async (booking: BookingSchemaInterface): Promise<boolean> => {
    console.log(`Processing payment for booking: ${booking._id}`);
    console.log(`Amount to charge: ${paymentService.calculateAmount(booking.service)}`);
    
    return true;
  },
  
  refundPayment: async (booking: BookingSchemaInterface): Promise<boolean> => {
    console.log(`Refunding payment for booking: ${booking._id}`);
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
