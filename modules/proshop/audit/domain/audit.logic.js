export function normalizeAuditLog(raw) {
  return {
    id: raw.id,
    action: raw.action,
    entity: raw.entity,
    user: raw.user || "System",
    createdAt: new Date(raw.createdAt).toLocaleString(),
  };
}
