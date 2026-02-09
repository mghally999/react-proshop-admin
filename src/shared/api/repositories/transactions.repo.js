import { db, persist } from "../mock/db/store.js";
import { uid } from "@shared/lib/id.js";
import { nowISO } from "@shared/lib/dates.js";

export const transactionsRepo = {
  list() {
    return db().transactions;
  },

  create(tx) {
    const state = db();

    const record = {
      id: uid(),
      createdAt: nowISO(),
      status: tx.type === "rent" ? "rented" : "sold",
      ...tx,
    };

    state.transactions.unshift(record);
    persist();
    return record;
  },

  markReturned(id) {
    const state = db();
    const tx = state.transactions.find((t) => t.id === id);

    if (!tx) return null;

    tx.status = "returned";
    tx.returnedAt = nowISO();
    persist();

    return tx;
  },
};
