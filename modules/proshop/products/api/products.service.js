// src/modules/proshop/products/api/products.service.js
import productsRepo from "/shared/api/repositories/products.repo.js";

export const productsService = {
  list(params) {
    return productsRepo.list(params);
  },
  getById(id) {
    return productsRepo.getById(id);
  },
  create(payload) {
    return productsRepo.create(payload);
  },
  update(id, payload) {
    return productsRepo.update(id, payload);
  },
};
