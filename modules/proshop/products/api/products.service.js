import productsMock from "@shared/api/mock/handlers/products.mock.js";

export const productsService = {
  list(params) {
    return productsMock.list(params);
  },
  getById(id) {
    return productsMock.getById(id);
  },
  create(payload) {
    return productsMock.create(payload);
  },
  update(id, payload) {
    return productsMock.update(id, payload);
  },
  remove(id) {
    return productsMock.remove(id);
  },
};
