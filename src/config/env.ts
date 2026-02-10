import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  mailer: {
    apiKey: process.env.MAILER_API_KEY,
    from: process.env.MAILER_FROM,
  },
  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL,
  },
  payments: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  },
};
