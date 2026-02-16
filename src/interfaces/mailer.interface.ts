export interface Mailer {
  send(data: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void>;
}