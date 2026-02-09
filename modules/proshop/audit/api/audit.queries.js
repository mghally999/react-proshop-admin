import { useQuery } from "@tanstack/react-query";
import { auditService } from "./audit.service.js";

export function useAuditLogs() {
  return useQuery({
    queryKey: ["audit"],
    queryFn: () => auditService.list(),
  });
}
