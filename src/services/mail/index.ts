import { createSesMailer } from "./ses.mailer";
import { createSendgridMailer } from "./sendgrid.mailer";
import { createSmtpMailer } from "./smtp.mailer";
import { Mailer } from "../../interfaces/mailer.interface";

const required = (name: string) => {
  if (!process.env[name]) {
    throw new Error(`Missing env var: ${name}`);
  }
  return process.env[name]!;
}

export const createMailer = (): Mailer => {
  const provider = process.env.MAIL_SERVICE;

  if (!provider) {
    throw new Error("MAIL_SERVICE not defined");
  }

  switch (provider) {

    case "ses":
      return createSesMailer();

    case "sendgrid":
      required("SENDGRID_API_KEY");
      return createSendgridMailer();

    case "smtp":
      required("SMTP_HOST");
      required("SMTP_PORT");
      required("SMTP_USER");
      required("SMTP_PASS");
      return createSmtpMailer();

    default:
      throw new Error(`Invalid MAIL_SERVICE: ${provider}`);
  }
}

export const mailService = createMailer();