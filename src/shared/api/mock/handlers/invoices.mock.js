import { db } from "../db/store.js";

export const invoicesMock = {
  list() {
    return { items: db().invoices, total: db().invoices.length };
  },
  getById(id) {
    return db().invoices.find((x) => String(x.id) === String(id)) || null;
  },
};

export default invoicesMock;
