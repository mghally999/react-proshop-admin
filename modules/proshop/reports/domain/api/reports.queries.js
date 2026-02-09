import { useQuery } from "@tanstack/react-query";
import { reportsService } from "./reports.service.js";

/**
 * Reports overview (US-09)
 * - Sales
 * - Rentals
 * - Stock movements
 */
export function useReports(params = {}) {
  return useQuery({
    queryKey: ["reports", params],
    queryFn: () => reportsService.overview(params),
  });
}
