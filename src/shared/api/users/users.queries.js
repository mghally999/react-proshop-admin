import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import usersService from "./users.service.js";

export const usersKeys = {
  all: ["users"],
  list: (params) => ["users", "list", params ?? {}],
};

export function useUsers(params = { search: "", limit: 200 }) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => usersService.list(params),
    staleTime: 10_000,
  });
}

export function useImportFakeStoreUsers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => usersService.importFakeStoreUsers(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => usersService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}
