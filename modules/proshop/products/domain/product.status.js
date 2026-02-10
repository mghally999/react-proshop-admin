import { db, persist } from "@shared/api/mock/db/store.js";
import { nowISO } from "@shared/lib/dates.js";
import { uid } from "../db/seed.js";

export function addAudit(entry) {
  const state = db();
  state.auditLogs.unshift({
    id: uid("audit"),
    at: nowISO(),
    ...entry,
  });
  persist();
}

export function addNotification(n) {
  const state = db();
  state.notifications.unshift({
    id: uid("n"),
    at: nowISO(),
    read: false,
    channel: "inApp",
    ...n,
  });
  persist();
}

export function addEmail(email) {
  // simulated email (stored same place, channel=email)
  const state = db();
  state.notifications.unshift({
    id: uid("email"),
    at: nowISO(),
    read: false,
    channel: "email",
    ...email,
  });
  persist();
}
