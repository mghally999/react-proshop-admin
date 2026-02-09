// src/shared/api/mock/utils/filters.js

export function matchesSearch(p, search) {
  const q = String(search || "").trim().toLowerCase();
  if (!q) return true;

  const hay = [
    p?.name,
    p?.sku,
    p?.category,
    p?.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return hay.includes(q);
}

export function filterByStatus(p, status) {
  if (!status || status === "all") return true;
  return String(p?.status || "").toLowerCase() === String(status).toLowerCase();
}

function getSortValue(p, field) {
  // map UI sort fields -> actual data keys
  const map = {
    price: "priceCents",
    stock: "stock",
    updatedAt: "updatedAt",
    name: "name",
    sku: "sku",
    category: "category",
  };

  const key = map[field] || field;
  const val = p?.[key];

  // normalize
  if (key === "updatedAt") return new Date(val || 0).getTime();
  if (typeof val === "string") return val.toLowerCase();
  if (typeof val === "number") return val;
  return val ?? "";
}

export function sortProducts(items, sort) {
  const raw = String(sort || "updatedAt:desc");
  const [field, dir] = raw.split(":");
  const direction = dir === "asc" ? 1 : -1;

  const arr = [...items];
  arr.sort((a, b) => {
    const va = getSortValue(a, field);
    const vb = getSortValue(b, field);
    if (va < vb) return -1 * direction;
    if (va > vb) return 1 * direction;
    return 0;
  });

  return arr;
}
