import express from "express";
import bookingsRoutes from "./routes/bookings";
import paymentsRoutes from "./routes/payments";

const app = express();

app.use(express.json());

app.use("/api/bookings", bookingsRoutes);
app.use("/api/payments", paymentsRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

export default app;