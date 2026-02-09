export function normalizeReport(raw) {
  return {
    id: raw.id,
    type: raw.type,
    period: raw.period,
    total: raw.total,
    createdAt: new Date(raw.createdAt).toLocaleString(),
  };
}
