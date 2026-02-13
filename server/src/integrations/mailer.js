import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let _transport = null;

function getTransport() {
  if (_transport) return _transport;

  // If SMTP is not configured, fall back to a console/json transport for demo.
  if (!env.EMAIL_HOST || !env.EMAIL_USER || !env.EMAIL_PASS) {
    _transport = nodemailer.createTransport({ jsonTransport: true });
    return _transport;
  }

  _transport = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: Number(env.EMAIL_PORT || 465),
    secure: String(env.EMAIL_SECURE || "true") === "true",
    auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
  });

  return _transport;
}

export async function sendEmail({ to, subject, text }) {
  const transport = getTransport();
  const from = env.EMAIL_FROM || env.EMAIL_USER || "no-reply@proshop.local";
  const info = await transport.sendMail({ from, to, subject, text });
  // When using jsonTransport, output is printed in server logs.
  return info;
}
