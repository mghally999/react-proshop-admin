import { useQuery } from "@tanstack/react-query";
import { transactionsService } from "./transactions.service";
import { queryKeys } from "../../../../shared/api/query/queryKeys";

export const useTransactions = (params) =>
  useQuery({
    queryKey: [queryKeys.transactions, params],
    queryFn: () => transactionsService.list(params),
    keepPreviousData: true,
  });
