import { useQuery } from "@tanstack/react-query";
import { transactionsService } from "./transactions.service.js";

export function useTransactions(params) {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => transactionsService.list(params),
  });
}
