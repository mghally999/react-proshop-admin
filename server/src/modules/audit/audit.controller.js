import { AuditLog } from "./audit.model.js";

/**
 * GET /api/audit
 * Query:
 *  - page, limit
 *  - action
 *  - entityType
 */
export async function listAudit(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit || 25)));
    const action = (req.query.action || "").trim();
    const entityType = (req.query.entityType || "").trim();

    const filter = {};
    if (action) filter.action = action;
    if (entityType) filter.entityType = entityType;

    const [total, items] = await Promise.all([
      AuditLog.countDocuments(filter),
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    res.json({
      page,
      limit,
      total,
      items: items.map((x) => ({
        id: String(x._id),
        action: x.action,
        entityType: x.entityType,
        entityId: x.entityId,
        adminId: x.adminId,
        details: x.details || {},
        createdAt: x.createdAt,
      })),
    });
  } catch (e) {
    next(e);
  }
}
