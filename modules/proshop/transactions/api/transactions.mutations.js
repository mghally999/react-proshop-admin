import { useMutation } from "@tanstack/react-query";
import { transactionsRepo } from "../../../../shared/api/repositories";

export function useCreateTransaction() {
  return useMutation({
    mutationFn: transactionsRepo.create,
  });
}
