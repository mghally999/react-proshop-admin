import { httpClient } from "@shared/api/http/httpClient.js";

export const transactionsService = {
  list(params) {
    return httpClient
      .get("/api/transactions", { params })
      .then((r) => r.data);
  },
  create(payload) {
    return httpClient.post("/api/transactions", payload).then((r) => r.data);
  },
  markReturned(id) {
    return httpClient.post(`/api/transactions/${id}/return`).then((r) => r.data);
  },
};

export default transactionsService;
