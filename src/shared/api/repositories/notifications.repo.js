import { db } from "../mock/db/store";
import { withLatency } from "../mock/utils/latency";

export const notificationsRepo = {
  list: withLatency(() => {
    const { notifications } = db();
    return {
      items: [...notifications],
      total: notifications.length,
    };
  }),

  push: withLatency((notification) => {
    const state = db();

    state.notifications.unshift({
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      read: false,
      ...notification,
    });

    return { success: true };
  }),

  markAllRead: withLatency(() => {
    const { notifications } = db();
    notifications.forEach((n) => (n.read = true));
    return { success: true };
  }),
};
