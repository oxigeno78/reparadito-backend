import { Request } from "express";
import { rateLimit, ipKeyGenerator } from "express-rate-limit";

export const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    if (req.ip == undefined) {
      console.error('WARN | `express-rate-limit` | `request.ip` is undefined. You can avoid this by providing a custom `keyGenerator` function, but it may be indicative of a larger issue.');
    }
    const ip = req.ip && req.ip.replace(/:\d+[^:]*$/, '') || "unknown"
    return `${ipKeyGenerator(ip)}:${req.get("user-agent") ?? "unknown"}`;
  }
});

export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    if (req.ip == undefined) {
      console.error('WARN | `express-rate-limit` | `request.ip` is undefined. You can avoid this by providing a custom `keyGenerator` function, but it may be indicative of a larger issue.');
    }
    const ip = req.ip && req.ip.replace(/:\d+[^:]*$/, '') || "unknown";
    return `${ipKeyGenerator(ip)}:${req.get("user-agent") ?? "unknown"}`;
  }
});

export const webhookLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 200,
  keyGenerator: (req: Request) => {
    if (req.ip == undefined) {
      console.error('WARN | `express-rate-limit` | `request.ip` is undefined. You can avoid this by providing a custom `keyGenerator` function, but it may be indicative of a larger issue.');
    }
    const ip = req.ip && req.ip.replace(/:\d+[^:]*$/, '') || "unknown";
    return `${ipKeyGenerator(ip)}:${req.get("user-agent") ?? "unknown"}`;
  }
});