import { useQuery } from "@tanstack/react-query";
import { reportsService } from "./reports.service";
import { queryKeys } from "../../../../../shared/api/query/queryKeys";

export function useReports(params = {}) {
  return useQuery({
    queryKey: [queryKeys.reports, params],
    queryFn: () => reportsService.list(params),
  });
}
