import { Link } from "react-router-dom";

import PageHeader from "@/app/layout/PageHeader.jsx";
import Skeleton from "@shared/ui/composites/Skeleton.jsx";
import EmptyState from "@shared/ui/composites/EmptyState.jsx";
import DataTable from "@shared/ui/data/DataTable/DataTable.jsx";

import { useInvoices } from "../../api/invoices.queries.js";

export default function InvoiceListPage() {
  const { data, isLoading } = useInvoices();

  if (isLoading) return <Skeleton rows={6} />;

  const items = data?.items || data || [];

  if (!items.length) {
    return (
      <>
        <PageHeader title="Invoices" />
        <EmptyState title="No invoices yet" description="Invoices will appear once you sell or rent items." />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Invoices" />
      <DataTable
        rows={items}
        columns={[
          {
            key: "invoiceNo",
            header: "Invoice",
            render: (row) => (
              <Link to={`/proshop/invoices/${row._id}`}>{row.invoiceNo || row._id}</Link>
            ),
          },
          { key: "type", header: "Type" },
          {
            key: "totalCents",
            header: "Total",
            render: (row) => `${(Number(row.totalCents || 0) / 100).toFixed(2)}`,
          },
          { key: "userId", header: "User" },
          {
            key: "createdAt",
            header: "Created",
            render: (row) => (row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"),
          },
        ]}
      />
    </>
  );
}
