import { AuditLog } from "./audit.model.js";

export async function addAudit(entry) {
  await AuditLog.create(entry);
}
