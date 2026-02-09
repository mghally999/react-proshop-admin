import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsService } from "./transactions.service.js";
import { queryKeys } from "@shared/api/query/queryKeys.js";

export function useCreateTransaction() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: transactionsService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.transactions.all });
      qc.invalidateQueries({ queryKey: queryKeys.products.all });
      qc.invalidateQueries({ queryKey: queryKeys.invoices.all });
    },
  });
}

export function useReturnRental() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => transactionsService.markReturned(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.transactions.all });
      qc.invalidateQueries({ queryKey: queryKeys.products.all });
      qc.invalidateQueries({ queryKey: queryKeys.invoices.all });
    },
  });
}
