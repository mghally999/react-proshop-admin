import { useMutation, useQueryClient } from "@tanstack/react-query";
import usersService from "@shared/api/users/users.service.js";

export function useImportUsers() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => usersService.importFakeStoreUsers(),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
