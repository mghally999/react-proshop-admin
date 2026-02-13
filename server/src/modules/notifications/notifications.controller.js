import { createNotification, listNotifications, markRead } from "./notifications.service.js";

export async function getNotifications(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 25)));
    const unreadOnly = String(req.query.unreadOnly || "false") === "true";

    const { total, items } = await listNotifications({ page, limit, unreadOnly });

    res.json({
      page,
      limit,
      total,
      items: items.map((n) => ({
        id: String(n._id),
        type: n.type,
        title: n.title,
        message: n.message,
        severity: n.severity,
        entityType: n.entityType,
        entityId: n.entityId,
        isRead: n.isRead,
        createdAt: n.createdAt,
      })),
    });
  } catch (e) {
    next(e);
  }
}

// For dev/testing only (admin UI doesn't need this now)
export async function postNotification(req, res, next) {
  try {
    const doc = await createNotification(req.body);
    res.status(201).json({ id: String(doc._id) });
  } catch (e) {
    next(e);
  }
}

export async function postMarkRead(req, res, next) {
  try {
    await markRead(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
