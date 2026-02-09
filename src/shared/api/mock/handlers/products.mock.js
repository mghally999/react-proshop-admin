// src/shared/api/mock/handlers/products.mock.js

import { db, persist } from "../db/store.js";
import { uid } from "@shared/lib/id.js"; // ✅ FIXED
import { nowISO } from "@shared/lib/dates.js";
import { addAudit } from "../utils/events.js";

function matches(p, q) {
  if (!q) return true;
  const s = q.toLowerCase();
  return (
    String(p.name || "").toLowerCase().includes(s) ||
    String(p.sku || "").toLowerCase().includes(s) ||
    String(p.category || "").toLowerCase().includes(s)
  );
}

function sortItems(items, sort = "updatedAt:desc") {
  const [key, dir] = String(sort).split(":");
  const sign = dir === "asc" ? 1 : -1;

  return [...items].sort((a, b) => {
    const av = a?.[key];
    const bv = b?.[key];
    if (av === bv) return 0;

    const ad = Date.parse(av);
    const bd = Date.parse(bv);
    if (!Number.isNaN(ad) && !Number.isNaN(bd)) return (ad - bd) * sign;

    if (typeof av === "number" && typeof bv === "number") return (av - bv) * sign;
    return String(av ?? "").localeCompare(String(bv ?? "")) * sign;
  });
}

function paginate(items, page = 1, pageSize = 10) {
  const p = Math.max(1, Number(page || 1));
  const ps = Math.max(1, Number(pageSize || 10));
  const start = (p - 1) * ps;
  const sliced = items.slice(start, start + ps);
  return {
    items: sliced,
    meta: {
      page: p,
      pageSize: ps,
      total: items.length,
      pages: Math.max(1, Math.ceil(items.length / ps)),
    },
  };
}

function computeInvStatus(p) {
  const vars = Array.isArray(p.variants) ? p.variants : [];
  const qty = vars.length
    ? vars.reduce((sum, v) => sum + Number(v.stock || 0), 0)
    : Number(p.stock || 0);

  const low = Number(p.lowStockThreshold ?? 5);
  if (qty <= 0) return "out";
  if (qty <= low) return "low";
  return "active";
}

const productsMock = {
  list(params = {}) {
    const {
      page = 1,
      pageSize = 10,
      search = "",
      status = "all",
      inv = "all",
      sort = "updatedAt:desc",
    } = params;

    const state = db();

    let items = state.products.filter((p) => !p.isDeleted);
    items = items.filter((p) => matches(p, search));

    if (status !== "all") items = items.filter((p) => p.status === status);
    if (inv !== "all") items = items.filter((p) => computeInvStatus(p) === inv);

    items = sortItems(items, sort);
    items = items.map((p) => ({ ...p, inventory: computeInvStatus(p) }));

    return paginate(items, page, pageSize);
  },

  getById(id) {
    const state = db();
    const p = state.products.find(
      (x) => String(x.id) === String(id) && !x.isDeleted
    );
    if (!p) throw new Error("Product not found");

    const media = state.media
      .filter((m) => m.productId === p.id)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return { ...p, media };
  },

  create(payload, adminId = "admin_1") {
    const state = db();

    const next = {
      id: uid("p"),
      ...payload,
      isDeleted: false,
      updatedAt: nowISO(),
      lowStockThreshold: Number(payload.lowStockThreshold ?? 5),
      variants: Array.isArray(payload.variants) ? payload.variants : [],
    };

    state.products.unshift(next);
    persist();

    addAudit({
      action: "product.create",
      adminId,
      entity: "product",
      entityId: next.id,
      meta: { name: next.name, sku: next.sku },
    });

    return next;
  },

  update(id, payload, adminId = "admin_1") {
    const state = db();
    const idx = state.products.findIndex((p) => String(p.id) === String(id));
    if (idx < 0) throw new Error("Product not found");

    const prev = state.products[idx];
    const updated = {
      ...prev,
      ...payload,
      id,
      updatedAt: nowISO(),
    };

    state.products[idx] = updated;
    persist();

    addAudit({
      action: "product.update",
      adminId,
      entity: "product",
      entityId: id,
      meta: { prev, next: updated },
    });

    return updated;
  },

  remove(id, adminId = "admin_1") {
    const state = db();
    const idx = state.products.findIndex((p) => String(p.id) === String(id));
    if (idx < 0) throw new Error("Product not found");

    state.products[idx] = {
      ...state.products[idx],
      isDeleted: true,
      status: "archived",
      deletedAt: nowISO(),
      updatedAt: nowISO(),
    };

    persist();

    addAudit({
      action: "product.delete",
      adminId,
      entity: "product",
      entityId: id,
    });

    return { ok: true };
  },
};

export default productsMock;
export { computeInvStatus };
