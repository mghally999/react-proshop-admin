import { auditRepo } from "../../../../shared/api/repositories/audit.repo";
import { normalizeAuditLog } from "../domain/audit.logic";

export const auditService = {
  async list(params = {}) {
    const res = await auditRepo.list(params);

    return {
      ...res,
      items: res.items.map(normalizeAuditLog),
    };
  },
};
