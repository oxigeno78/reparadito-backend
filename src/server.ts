import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";

async function bootstrap() {
  await connectDB();

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
}

bootstrap();