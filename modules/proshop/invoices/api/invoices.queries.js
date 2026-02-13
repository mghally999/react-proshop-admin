import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@shared/api/http/httpClient.js";
import { endpoints } from "@shared/api/http/endpoints.js";

/**
 * Fetch all invoices
 */
export function useInvoices(params = {}) {
  return useQuery({
    queryKey: ["invoices", params],
    queryFn: async () => {
      const res = await httpClient.get(endpoints.invoices.list, {
        params,
      });
      return res.data;
    },
  });
}

/**
 * Fetch single invoice by id
 */
export function useInvoice(id) {
  return useQuery({
    queryKey: ["invoice", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await httpClient.get(
        endpoints.invoices.details(id)
      );
      return res.data;
    },
  });
}
