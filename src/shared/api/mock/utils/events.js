import { uid } from "@shared/lib/id.js";
import { nowISO } from "@shared/lib/dates.js";
import { db, persist } from "../db/store.js";

const bus = new EventTarget();

export function emit(event, detail) {
  bus.dispatchEvent(new CustomEvent(event, { detail }));
}

export function on(event, handler) {
  const fn = (e) => handler(e.detail);
  bus.addEventListener(event, fn);
  return () => bus.removeEventListener(event, fn);
}

export function addAudit(entry) {
  const item = {
    id: uid("a"),
    at: nowISO(),
    adminId: entry.adminId || "admin-1",
    action: entry.action,
    entity: entry.entity,
    entityId: entry.entityId || null,
    userId: entry.userId || null,
    meta: entry.meta || {},
  };
  db().audit.unshift(item);
  persist({ entity: "audit", action: "add" });
  return item;
}

export function addNotification(entry) {
  const item = {
    id: uid("n"),
    at: nowISO(),
    to: entry.to || "admin", // "admin" | "user"
    userId: entry.userId || null,
    title: entry.title,
    message: entry.message,
    kind: entry.kind || "info", // info | success | warning | danger
    read: false,
  };
  db().notifications.unshift(item);
  persist({ entity: "notifications", action: "add" });
  return item;
}

export function dbChanged(payload) {
  emit("ps:db", payload);
}
