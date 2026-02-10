import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "./products.service.js";

export function useCreateProductMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => productsService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProductMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => productsService.update(id, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", vars?.id] });
    },
  });
}

export function useDeleteProductMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => productsService.remove(id),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.removeQueries({ queryKey: ["product", vars?.id] });
    },
  });
}

export function useImportFakeStoreMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => productsService.importFakeStore(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
