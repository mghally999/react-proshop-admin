import { useQuery } from "@tanstack/react-query";
import { auditService } from "./audit.service";
import { queryKeys } from "../../../../shared/api/query/queryKeys";

export function useAuditLogs(params = {}) {
  return useQuery({
    queryKey: [queryKeys.audit, params],
    queryFn: () => auditService.list(params),
  });
}
