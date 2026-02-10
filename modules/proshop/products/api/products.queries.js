import { useQuery } from "@tanstack/react-query";
import { productsService } from "./products.service.js";

export function useProductsListQuery(params) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsService.list(params),
    keepPreviousData: true,
  });
}

// ✅ Backward-compatible export name (fixes your error)
export function useProductsQuery(params) {
  return useProductsListQuery(params);
}

export function useProductQuery(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsService.getById(id),
    enabled: Boolean(id),
  });
}

// ✅ Backward-compatible alias (in case any page uses it)
export function useProductByIdQuery(id) {
  return useProductQuery(id);
}
