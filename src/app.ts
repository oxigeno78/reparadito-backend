import express from "express";
import bookingsRoutes from "./routes/bookings";
import paymentsRoutes from "./routes/payments";
import mpRoutes from "./routes/mp";

const app = express();

app.use(express.json());

app.use("/api/bookings", bookingsRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/webhooks", mpRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

export default app;