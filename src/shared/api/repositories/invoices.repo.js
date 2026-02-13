import { httpClient } from "../http/httpClient.js";
import { endpoints } from "../http/endpoints.js";

export const invoicesRepo = {
  async list(params) {
    const res = await httpClient.get(endpoints.invoices.list, { params });
    return res.data;
  },
  async getById(id) {
    const res = await httpClient.get(endpoints.invoices.details(id));
    return res.data;
  },
};
