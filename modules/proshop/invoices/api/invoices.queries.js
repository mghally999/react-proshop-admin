// invoices.queries.js
export function useInvoice(id) {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => invoicesRepo.getById(id),
    enabled: !!id,
  });
}
