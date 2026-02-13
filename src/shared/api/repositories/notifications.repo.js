import { httpClient } from "../http/httpClient.js";
import { endpoints } from "../http/endpoints.js";

export const notificationsRepo = {
  async list(params) {
    const res = await httpClient.get(endpoints.notifications.list, { params });
    return res.data;
  },
  async markRead(id) {
    const res = await httpClient.post(endpoints.notifications.markRead(id));
    return res.data;
  },
};
