import { db, persist } from "@shared/api/mock/db/store.js";

const notificationsMock = {
  list(params = {}) {
    const state = db();
    let items = [...state.notifications];

    if (params.to) items = items.filter((n) => n.to === params.to);
    if (params.channel)
      items = items.filter((n) => n.channel === params.channel);

    return { items, total: items.length };
  },

  markRead(id) {
    const state = db();
    const idx = state.notifications.findIndex(
      (n) => String(n.id) === String(id)
    );
    if (idx < 0) return { ok: false };
    state.notifications[idx] = { ...state.notifications[idx], read: true };
    persist();
    return { ok: true };
  },
};

export default notificationsMock;
