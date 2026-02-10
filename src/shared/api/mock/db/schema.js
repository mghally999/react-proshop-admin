export function createEmptyState() {
  return {
    products: [],
    transactions: [],
    invoices: [],
    reports: [],
    audits: [],
    notifications: [],
    media: [], // ✅ must be array
    users: [],
  };
}
