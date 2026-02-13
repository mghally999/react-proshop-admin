// src/modules/proshop/products/api/products.service.js
// IMPORTANT: We do NOT call FakeStore directly from the UI.
// FakeStore is only used as a seed/import source via our backend.

import { httpClient } from "@shared/api/http/httpClient.js";
import { toProductPayload } from "../domain/product.logic.js";

function pickListParams(params = {}) {
  const page = Number(params.page ?? 1);
  const pageSize = Number(params.pageSize ?? 10);
  const search = String(params.search ?? "").trim();
  const status = String(params.status ?? "all");
  const sort = String(params.sort ?? "updatedAt:desc");

  return { page, pageSize, search, status, sort };
}

export const productsService = {
  async list(params = {}) {
    const qp = pickListParams(params);
    const res = await httpClient.get("/api/products", { params: qp });
    return res.data;
  },

  async getById(id) {
    const res = await httpClient.get(`/api/products/${id}`);
    return res.data;
  },

  async create(formValues) {
    const payload = toProductPayload(formValues);
    const res = await httpClient.post("/api/products", payload);
    return res.data;
  },

  async update(id, formValues) {
    const payload = toProductPayload(formValues);
    const res = await httpClient.put(`/api/products/${id}`, payload);
    return res.data;
  },

  async remove(id) {
    // Hard delete default (as requested)
    const res = await httpClient.delete(`/api/products/${id}`);
    return res.data;
  },

  async importFakeStore() {
    const res = await httpClient.post("/api/products/import-fakestore");
    return res.data;
  },
};
