import { httpClient } from "../http/httpClient.js";
import { endpoints } from "../http/endpoints.js";

export const productsRepo = {
  async list(params) {
    const res = await httpClient.get(endpoints.products.list, { params });
    return res.data;
  },
  async getById(id) {
    const res = await httpClient.get(endpoints.products.details(id));
    return res.data;
  },
  async create(payload) {
    const res = await httpClient.post(endpoints.products.list, payload);
    return res.data;
  },
  async update(id, payload) {
    const res = await httpClient.patch(endpoints.products.details(id), payload);
    return res.data;
  },
  async remove(id) {
    const res = await httpClient.delete(endpoints.products.details(id));
    return res.data;
  },
  async importFakeStore() {
    const res = await httpClient.post(endpoints.products.importFakeStore);
    return res.data;
  },
};
