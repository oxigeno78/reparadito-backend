import nodemailer from "nodemailer";
import { Mailer } from "../../interfaces/mailer.interface";

export const createSmtpMailer = (): Mailer => {

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return {
    async send({ to, subject, html }) {

      await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html
      });
    }
  };
}