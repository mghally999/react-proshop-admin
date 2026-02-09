// src/shared/api/mock/handlers/products.mock.js
import { db } from "/shared/api/mock/db/store.js";
import { withLatency } from "/shared/api/mock/utils/latency.js";
import { paginate } from "/shared/api/mock/utils/pagination.js";
import {
  filterByStatus,
  matchesSearch,
  sortProducts,
} from "/shared/api/mock/utils/filters.js";
import { nowISO } from "/shared/lib/dates.js";
import { uid } from "/shared/lib/id.js";

function listImpl(params = {}) {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    status = "all",
    sort = "updatedAt:desc",
  } = params;

  const items = db()
    .products.filter((p) => matchesSearch(p, search))
    .filter((p) => filterByStatus(p, status));

  const sorted = sortProducts(items, sort);
  return paginate(sorted, { page, pageSize });
}

function getByIdImpl(id) {
  const item = db().products.find((p) => p.id === id);
  if (!item) throw new Error("Product not found");
  return item;
}

function createImpl(payload) {
  const next = {
    ...payload,
    id: uid("p"),
    updatedAt: nowISO(),
  };
  db().products.unshift(next);
  return next;
}

function updateImpl(id, payload) {
  const idx = db().products.findIndex((p) => p.id === id);
  if (idx < 0) throw new Error("Product not found");

  const updated = {
    ...db().products[idx],
    ...payload,
    id,
    updatedAt: nowISO(),
  };

  db().products[idx] = updated;
  return updated;
}

export const productsMock = {
  list: withLatency(listImpl),
  getById: withLatency(getByIdImpl),
  create: withLatency(createImpl),
  update: withLatency(updateImpl),
};

export default productsMock;
