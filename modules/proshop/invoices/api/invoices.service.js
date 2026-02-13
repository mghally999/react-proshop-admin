import { httpClient } from "@shared/api/http/httpClient.js";

export const invoicesService = {
  list() {
    return httpClient.get("/api/invoices").then((r) => r.data);
  },
  getById(id) {
    return httpClient.get(`/api/invoices/${id}`).then((r) => r.data);
  },
};
