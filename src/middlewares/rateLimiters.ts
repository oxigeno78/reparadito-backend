import { rateLimit } from "express-rate-limit";

export const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = req.ip || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    return ip + userAgent;
  }
});

export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = req.ip || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    return ip + userAgent;
  }
});

export const webhookLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 200,
  keyGenerator: (req) => {
    const ip = req.ip || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";
    return ip + userAgent;
  }
});