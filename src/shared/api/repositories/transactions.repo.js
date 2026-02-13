import { httpClient } from "../http/httpClient.js";
import { endpoints } from "../http/endpoints.js";

// NOTE: this repo is kept for architecture consistency.
// The proshop module services call backend directly, but some shared components
// may prefer using repos.
export const transactionsRepo = {
  async list(params) {
    const res = await httpClient.get(endpoints.transactions.list, { params });
    return res.data;
  },
  async create(payload) {
    const res = await httpClient.post(endpoints.transactions.list, payload);
    return res.data;
  },
  async markReturned(id) {
    const res = await httpClient.post(endpoints.transactions.returnRental(id));
    return res.data;
  },
};
