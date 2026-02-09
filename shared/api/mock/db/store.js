import { seedProducts } from "/shared/api/mock/db/seed.js";

const state = {
  products: seedProducts(),
  transactions: [],
  auditLogs: [],
  invoices: [],
  reports: [],
};

export function db() {
  return state;
}

export function resetDb() {
  state.products = seedProducts();
  state.transactions = [];
  state.auditLogs = [];
  state.invoices = [];
  state.reports = [];
}
