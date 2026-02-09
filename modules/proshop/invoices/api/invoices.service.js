import invoicesMock from "@shared/api/mock/handlers/invoices.mock.js";

export const invoicesService = {
  list() {
    return invoicesMock.list();
  },
  getById(id) {
    return invoicesMock.getById(id);
  },
};
