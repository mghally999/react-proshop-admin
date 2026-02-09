// src/shared/api/repositories/products.repo.js
import { seedProducts } from "../mock/db/seed";

// Storage key
const KEY = "proshop_admin_products_v1";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function ensureSeeded() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seedProducts()));
  }
}

function readAll() {
  ensureSeeded();
  return safeParse(localStorage.getItem(KEY), []);
}

function writeAll(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function makeId() {
  return `p_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function compare(a, b) {
  if (a === b) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  if (typeof a === "number" && typeof b === "number") return a - b;

  const ad = Date.parse(a);
  const bd = Date.parse(b);
  if (!Number.isNaN(ad) && !Number.isNaN(bd)) return ad - bd;

  return String(a).localeCompare(String(b));
}

function sortItems(items, sort) {
  if (!sort?.key) return items;

  const { key, dir } = sort;
  const sign = dir === "asc" ? 1 : -1;

  return [...items].sort((x, y) => {
    let ax;
    let by;

    // table key "stock" maps to data "stockQty"
    if (key === "stock") {
      ax = x.stockQty ?? 0;
      by = y.stockQty ?? 0;
    } else {
      ax = x[key];
      by = y[key];
    }

    return compare(ax, by) * sign;
  });
}

function paginate(items, page = 1, pageSize = 10) {
  const p = Math.max(1, Number(page || 1));
  const ps = Math.max(1, Number(pageSize || 10));
  const start = (p - 1) * ps;
  return items.slice(start, start + ps);
}

/**
 * ✅ IMPORTANT:
 * Export BOTH named + default to prevent “does not provide an export named …” forever.
 */
export const productsRepo = {
  async list({ page = 1, pageSize = 10, sort } = {}) {
    await sleep(150);
    const all = readAll();
    const sorted = sortItems(all, sort);
    const items = paginate(sorted, page, pageSize);

    return {
      items,
      total: sorted.length,
      page,
      pageSize,
    };
  },

  async getById(id) {
    await sleep(120);
    const all = readAll();
    return all.find((p) => String(p.id) === String(id)) || null;
  },

  async create(payload) {
    await sleep(180);
    const all = readAll();

    const created = {
      id: makeId(),
      name: payload?.name ?? "Untitled product",
      sku: payload?.sku ?? "",
      category: payload?.category ?? "",
      price: Number(payload?.price ?? 0),
      stockQty: Number(payload?.stockQty ?? 0),
      status: payload?.status ?? "draft",
      updatedAt: today(),
      description: payload?.description ?? "",
    };

    writeAll([created, ...all]);
    return created;
  },

  async update(id, payload) {
    await sleep(180);
    const all = readAll();
    const idx = all.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return null;

    const prev = all[idx];
    const updated = {
      ...prev,
      ...payload,
      price: Number(payload?.price ?? prev.price ?? 0),
      stockQty: Number(payload?.stockQty ?? prev.stockQty ?? 0),
      updatedAt: today(),
    };

    const next = [...all];
    next[idx] = updated;
    writeAll(next);

    return updated;
  },
};

export default productsRepo;
