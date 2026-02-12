import { Router, Request, Response } from 'express';
import { Payment } from 'mercadopago';
import Booking from '../models/Booking';
import { Status } from '../interfaces/booking.interface';
import mp from '../config/mp';

const router = Router();
const paymentClient = new Payment(mp);

router.post('/mp', async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;
    // Validación mínima
    if (type !== 'payment' || !data?.id) {
      return res.status(200).send('Ignored');
    }
    const paymentId = data.id;

    // Consultar pago real
    const payment = await paymentClient.get({ id: paymentId });
    const paymentData = payment;
    if (!paymentData) {
      throw new Error('No payment data');
    }
    const status = paymentData.status; // approved, rejected, pending
    const externalRef = paymentData.external_reference;
    if (!externalRef) {
      throw new Error('Missing external_reference');
    }

    // Buscar booking
    const booking = await Booking.findById(externalRef);
    if (!booking) {
      console.warn('Booking not found:', externalRef);
      return res.sendStatus(200);
    }

    // Anti-duplicados
    if (booking.status === Status.PAID) {
      return res.sendStatus(200);
    }

    // Procesar estado
    if (status === 'approved') {
      booking.status = Status.PAID;
      booking.paymentId = paymentId;
      booking.paymentAt = new Date();

      await booking.save();
    } else if (status === 'rejected' || status === 'cancelled') {
      booking.status = Status.FAILED;
      await booking.save();
    } else {
      // pending, in_process
      booking.status = Status.PROCESSING;
      await booking.save();
    }
    return res.sendStatus(200);
  } catch (err) {
    console.error('MP Webhook Error:', err);
    return res.sendStatus(500);
  }
});

export default router;