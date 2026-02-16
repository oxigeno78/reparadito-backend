import sg from "@sendgrid/mail";
import { Mailer } from "../../interfaces/mailer.interface";

export const createSendgridMailer = (): Mailer => {

  sg.setApiKey(process.env.SENDGRID_API_KEY!);

  return {
    async send({ to, subject, html }) {

      await sg.send({
        to,
        from: process.env.MAIL_FROM!,
        subject,
        html
      });
    }
  };
}