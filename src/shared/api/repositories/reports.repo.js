import { httpClient } from "../http/httpClient.js";
import { endpoints } from "../http/endpoints.js";

export const reportsRepo = {
  async overview(params) {
    const res = await httpClient.get(endpoints.reports.overview, { params });
    return res.data;
  },
};
