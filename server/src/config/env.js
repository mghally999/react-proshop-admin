export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 4000),

  MONGODB_URI:
    process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/proshop-admin",

  SESSION_SECRET: process.env.SESSION_SECRET ?? "dev_secret_change_me",
  SESSION_TTL_MINUTES: Number(process.env.SESSION_TTL_MINUTES ?? 10),

  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
