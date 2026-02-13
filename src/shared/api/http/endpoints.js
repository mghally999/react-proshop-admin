export const endpoints = {
  auth: {
    login: "/api/auth/login",
    me: "/api/auth/me",
    logout: "/api/auth/logout",
  },
  products: {
    list: "/api/products",
    details: (id) => `/api/products/${id}`,
    importFakeStore: "/api/products/import-fakestore",
  },
  users: {
    list: "/api/users",
    details: (id) => `/api/users/${id}`,
    importFakeStore: "/api/users/import-fakestore",
  },
  transactions: {
    list: "/api/transactions",
    returnRental: (id) => `/api/transactions/${id}/return`,
  },
  invoices: {
    list: "/api/invoices",
    details: (id) => `/api/invoices/${id}`,
    pdf: (id) => `/api/invoices/${id}/pdf`,
  },
  dashboard: {
    metrics: "/api/dashboard/metrics",
  },
  reports: {
    overview: "/api/reports/overview",
  },
  audit: {
    list: "/api/audit",
  },
  notifications: {
    list: "/api/notifications",
    markRead: (id) => `/api/notifications/${id}/read`,
  },
};
