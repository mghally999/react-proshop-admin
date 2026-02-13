import { httpClient } from "@shared/api/http/httpClient.js";

export const auditService = {
  async list({ page = 1, limit = 25, action, entityType } = {}) {
    const { data } = await httpClient.get("/api/audit", {
      params: { page, limit, action, entityType },
    });
    return data;
  },
};
