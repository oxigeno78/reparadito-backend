import axios from "axios";

export async function notifySlack(message: string) {
  if (!process.env.SLACK_WEBHOOK_URL) return;

  await axios.post(process.env.SLACK_WEBHOOK_URL, { text: message });
}