// src/modules/proshop/products/api/products.mutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "/modules/proshop/products/api/products.service.js";

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
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", vars?.id] });
    },
  });
}
