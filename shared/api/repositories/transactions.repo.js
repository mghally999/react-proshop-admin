import { db } from "../mock/db/store";
import { withLatency } from "../mock/utils/latency";

export const transactionsRepo = {
  list: withLatency((params = {}) => {
    const { transactions } = db();
    let items = [...transactions];

    if (params.type) {
      items = items.filter((t) => t.type === params.type);
    }

    if (params.status) {
      items = items.filter((t) => t.status === params.status);
    }

    return {
      items,
      total: items.length,
    };
  }),

  create: withLatency((payload) => {
    const state = db();

    const transaction = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      status: payload.type === "rent" ? "active" : "completed",
      ...payload,
    };

    state.transactions.unshift(transaction);
    return transaction;
  }),
};
