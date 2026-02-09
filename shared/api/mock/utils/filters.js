// src/shared/api/mock/utils/filters.js

export function normalizeText(v) {
  return String(v ?? "")
    .trim()
    .toLowerCase();
}

export function matchesSearch(product, search) {
  const q = normalizeText(search);
  if (!q) return true;

  const hay = [product.name, product.sku, product.category, product.status]
    .map(normalizeText)
    .join(" ");

  return hay.includes(q);
}

export function filterByStatus(product, status) {
  const s = normalizeText(status);
  if (!s || s === "all") return true;
  return normalizeText(product.status) === s;
}

export function sortProducts(items, sortKey = "updatedAt:desc") {
  const [field, dir] = String(sortKey).split(":");
  const mul = dir === "asc" ? 1 : -1;

  const getter = (p) => {
    switch (field) {
      case "name":
        return normalizeText(p.name);
      case "price":
        return Number(p.priceCents ?? 0);
      case "stock":
        return Number(p.stock ?? 0);
      case "status":
        return normalizeText(p.status);
      case "updatedAt":
      default:
        return new Date(p.updatedAt).getTime();
    }
  };

  // stable copy + sort
  return [...items].sort((a, b) => {
    const va = getter(a);
    const vb = getter(b);
    if (va < vb) return -1 * mul;
    if (va > vb) return 1 * mul;
    return 0;
  });
}
