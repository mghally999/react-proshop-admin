export const endpoints = {
  auth: {
    login: "/api/auth/login",
    me: "/api/auth/me",
    logout: "/api/auth/logout",
  },
  products: {
    list: "/api/products",
    details: (id) => `/api/products/${id}`,
    importFakeStore: "/api/products/_import/fakestore",
  },
};
