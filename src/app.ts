import express from "express";
import cors from "cors";
import bookingsRoutes from "./routes/bookings";
import paymentsRoutes from "./routes/payments";
import webhooksRoutes from "./routes/webhooks";
import { bookingLimiter, paymentLimiter, webhookLimiter } from "./middlewares/rateLimiters";

const app = express();
app.set("trust proxy", 1);
const localhostOrigins = ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"];

function isAllowedOrigin(origin: string): boolean {
  if (localhostOrigins.includes(origin)) return true;

  try {
    const { protocol, hostname } = new URL(origin);
    return protocol === "https:" && (hostname === "nizerapp.net" || hostname.endsWith(".nizerapp.net"));
  } catch {
    return false;
  }
}

const allowedMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"];
const allowedHeaders = ["Content-Type", "Authorization"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origen no permitido: ${origin}`));
    }
  },
  methods: allowedMethods,
  allowedHeaders,
  optionsSuccessStatus: 200,
  credentials: true,
  maxAge: 86400
}));

app.use(express.json());

app.use("/api/bookings", bookingLimiter, bookingsRoutes);
app.use("/api/payments", paymentLimiter, paymentsRoutes);
app.use("/api/webhooks", webhookLimiter, webhooksRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

export default app;