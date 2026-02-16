import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { Mailer } from "../../interfaces/mailer.interface";

export const createSesMailer = (): Mailer => {

  const config: any = {
    region: process.env.AWS_REGION || "us-east-1"
  };

  // Solo si existen → se usan
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    };
  }

  const client = new SESClient(config);

  return {
    async send({ to, subject, html }) {

      const cmd = new SendEmailCommand({
        Source: process.env.MAIL_FROM,
        Destination: {
          ToAddresses: [to]
        },
        Message: {
          Subject: {
            Data: subject
          },
          Body: {
            Html: {
              Data: html
            }
          }
        }
      });
      await client.send(cmd);
    }
  };
}