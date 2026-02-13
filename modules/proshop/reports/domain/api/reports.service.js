import { httpClient } from "@shared/api/http/httpClient.js";

export const reportsService = {
  async overview({ days = 7 } = {}) {
    const { data } = await httpClient.get("/api/reports/overview", {
      params: { days },
    });
    return data;
  },
};
