import { MercadoPagoConfig } from 'mercadopago';

const mpConfig = new MercadoPagoConfig ({
  accessToken: process.env.MP_ACCESS_TOKEN as string
});

export default mpConfig;