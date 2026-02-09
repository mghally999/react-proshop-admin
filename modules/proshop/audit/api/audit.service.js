import auditMock from "@shared/api/mock/handlers/audit.mock.js";

export const auditService = {
  list() {
    return auditMock.list();
  },
};
