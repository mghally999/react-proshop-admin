import { db } from "../mock/db/store";
import { withLatency } from "../mock/utils/latency";

export const auditRepo = {
  list: withLatency(() => {
    const { auditLogs } = db();
    return {
      items: [...auditLogs],
      total: auditLogs.length,
    };
  }),

  log: withLatency((entry) => {
    const state = db();

    state.auditLogs.unshift({
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      user: "Admin",
      ...entry,
    });

    return { success: true };
  }),
};
