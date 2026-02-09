import transactionsMock from "@shared/api/mock/handlers/transactions.mock.js";

export const transactionsService = {
  list(params) {
    return transactionsMock.list(params);
  },
  create(payload) {
    return transactionsMock.create(payload);
  },
  markReturned(id) {
    return transactionsMock.markReturned(id);
  },
};

export default transactionsService;
