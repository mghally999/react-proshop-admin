import { useQuery } from "@tanstack/react-query";
import { invoicesService } from "./invoices.service.js";

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: () => invoicesService.list(),
  });
}

export function useInvoice(id) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoicesService.getById(id),
    enabled: Boolean(id),
  });
}
