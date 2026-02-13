import { httpClient } from "../http/httpClient.js";
import { endpoints } from "../http/endpoints.js";

export const auditRepo = {
  async list(params) {
    const res = await httpClient.get(endpoints.audit.list, { params });
    return res.data;
  },
};
