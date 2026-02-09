import { useQuery } from "@tanstack/react-query";
import { productsService } from "./products.service.js";

export function useProductsListQuery(params) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsService.list(params),
  });
}

export function useProductQuery(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsService.getById(id),
    enabled: Boolean(id),
  });
}

// ✅ for SellRentDrawer (your code expects useProducts)
export function useProducts(params) {
  return useProductsListQuery(params);
}
