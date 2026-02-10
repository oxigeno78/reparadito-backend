import { Router } from 'express';
import { Preference } from 'mercadopago';
import mp from '../config/mp';

const router = Router();

/**
 * Crear pago
 */
router.post('/create', async (req, res) => {
    try {

        const { bookingId, price, customerEmail } = req.body;

        if (!bookingId || !price) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        const preference = new Preference(mp);

        preference.create({
            body: {
                items: [
                    {
                        id: bookingId,
                        title: 'Mantenimiento preventivo PC/Laptop',
                        quantity: 1,
                        unit_price: Number(price),
                        currency_id: 'MXN'
                    }
                ],

                payer: {
                    email: customerEmail
                },

                back_urls: {
                    success: 'https://reparadito.nizerapp.net/pago-exitoso',
                    failure: 'https://reparadito.nizerapp.net/pago-error',
                    pending: 'https://reparadito.nizerapp.net/pago-pendiente'
                },

                auto_return: 'approved',

                notification_url:
                    'https://api.reparadito.nizerapp.net/api/webhooks/mp',

                external_reference: bookingId
            }
        }).then((result) => {
            console.log('result', result);
            res.json({
                id: result.id,
                init_point: result.init_point
            });
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Error creando pago'
        });
    }
});

export default router;