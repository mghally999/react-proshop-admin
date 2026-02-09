// src/modules/proshop/products/api/products.queries.js
import { useQuery } from "@tanstack/react-query";
import { productsService } from "/modules/proshop/products/api/products.service.js";

export function useProductsListQuery(params = {}) {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    status = "all",
    sort = "updatedAt:desc",
  } = params;

  return useQuery({
    queryKey: ["products", { page, pageSize, search, status, sort }],
    queryFn: () =>
      productsService.list({ page, pageSize, search, status, sort }),
    keepPreviousData: true,
    staleTime: 15_000,
  });
}

export function useProductQuery(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsService.getById(id),
    enabled: Boolean(id),
    staleTime: 15_000,
  });
}
