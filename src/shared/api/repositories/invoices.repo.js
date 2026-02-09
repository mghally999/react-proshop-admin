import { db } from "../mock/db/store";
import { withLatency } from "../mock/utils/latency";

export const invoicesRepo = {
  list: withLatency(() => {
    const { invoices } = db();
    return {
      items: [...invoices],
      total: invoices.length,
    };
  }),

  getById: withLatency((id) => {
    const { invoices } = db();
    return invoices.find((i) => i.id === id);
  }),

  create: withLatency((invoice) => {
    const state = db();

    const newInvoice = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      status: "issued",
      ...invoice,
    };

    state.invoices.unshift(newInvoice);
    return newInvoice;
  }),
};
