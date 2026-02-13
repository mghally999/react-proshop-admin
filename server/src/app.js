import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";

import { env } from "./config/env.js";
import authRoutes from "./modules/auth/auth.routes.js";
import productsRoutes from "./modules/products/products.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import transactionsRoutes from "./modules/transactions/transactions.routes.js";
import invoicesRoutes from "./modules/invoices/invoices.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import auditRoutes from "./modules/audit/audit.routes.js";
import notificationsRoutes from "./modules/notifications/notifications.routes.js";
import reportsRoutes from "./modules/reports/reports.routes.js";
import { notFound, errorHandler } from "./middlewares/error.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());

  // If you use Vite proxy, this is optional.
  // If you call backend directly, this is required.
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(
    session({
      name: "proshop.sid",
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: env.NODE_ENV === "production",
        maxAge: env.SESSION_TTL_MINUTES * 60 * 1000,
      },
      store: MongoStore.create({
        mongoUrl: env.MONGODB_URI,
        ttl: env.SESSION_TTL_MINUTES * 60,
      }),
    })
  );

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/products", productsRoutes);
  app.use("/api/users", usersRoutes);
  app.use("/api/transactions", transactionsRoutes);
  app.use("/api/invoices", invoicesRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/audit", auditRoutes);
  app.use("/api/notifications", notificationsRoutes);
  app.use("/api/reports", reportsRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
