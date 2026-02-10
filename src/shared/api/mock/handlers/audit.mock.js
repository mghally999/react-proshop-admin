import { db } from "@shared/api/mock/db/store.js";

export const auditMock = {
  list() {
    return { items: db().audit, total: db().audit.length };
  },
};

export default auditMock;
