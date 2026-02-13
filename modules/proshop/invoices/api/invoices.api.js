import { httpClient } from "@shared/api/http/httpClient.js";
import { endpoints } from "@shared/api/http/endpoints.js";

export async function fetchInvoices({ page = 1, pageSize = 20 } = {}) {
  const res = await httpClient.get(endpoints.invoices.list, {
    params: { page, pageSize },
  });
  return res.data;
}

export async function fetchInvoiceById(id) {
  const res = await httpClient.get(endpoints.invoices.details(id));
  return res.data.invoice;
}

export function getInvoicePdfUrl(id) {
  return endpoints.invoices.pdf(id);
}
