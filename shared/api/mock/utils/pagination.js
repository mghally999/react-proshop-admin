export function paginate(items, { page = 1, pageSize = 10 } = {}) {
  const p = Math.max(1, Number(page) || 1);
  const ps = Math.max(1, Number(pageSize) || 10);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / ps));
  const safePage = Math.min(p, totalPages);

  const start = (safePage - 1) * ps;
  const end = start + ps;

  return {
    items: items.slice(start, end),
    page: safePage,
    pageSize: ps,
    total,
    totalPages,
  };
}
