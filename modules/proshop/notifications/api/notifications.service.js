import { httpClient } from "@shared/api/http/httpClient.js";

export const notificationsService = {
  list({ page = 1, limit = 25, unreadOnly = false } = {}) {
    return httpClient
      .get("/api/notifications", { params: { page, limit, unreadOnly } })
      .then((r) => r.data);
  },
  markRead(id) {
    return httpClient.post(`/api/notifications/${id}/read`).then((r) => r.data);
  },
};
