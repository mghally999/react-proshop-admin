import { Notification } from "./notifications.model.js";
import { emitEvent } from "../../realtime/realtime.js";

export async function createNotification(payload) {
  const doc = await Notification.create(payload);
  emitEvent("notifications:created", { id: String(doc._id) });
  return doc;
}

export async function listNotifications({ page = 1, limit = 25, unreadOnly = false } = {}) {
  const filter = unreadOnly ? { isRead: false } : {};
  const [total, items] = await Promise.all([
    Notification.countDocuments(filter),
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);
  return { total, items };
}

export async function markRead(id) {
  const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
  emitEvent("notifications:updated", { id: String(id) });
  return updated;
}
