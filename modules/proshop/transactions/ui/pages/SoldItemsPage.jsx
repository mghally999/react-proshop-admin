// modules/proshop/transactions/ui/pages/SoldItemsPage.jsx
import PageHeader from "@/app/layout/PageHeader.jsx";
import DataTable from "@shared/ui/data/DataTable/DataTable.jsx";
import { useTransactions } from "@proshop/transactions/api/transactions.queries.js";
import { formatMoney } from "@proshop/products/domain/product.logic.js";
import { formatDate } from "@shared/lib/dates.js";

export default function SoldItemsPage() {
  const { data, isLoading } = useTransactions({ type: "sale", status: "sold" });

  return (
    <>
      <PageHeader title="Sold Items" subtitle="Completed sales (invoices generated automatically)." />

      <DataTable
        loading={isLoading}
        rows={data?.items || []}
        page={1}
        pageSize={50}
        total={data?.total || 0}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        columns={[
          { key: "productName", header: "Product" },
          { key: "userName", header: "User" },
          { key: "qty", header: "Qty", align: "right" },
          { key: "totalCents", header: "Total", align: "right", render: (r) => formatMoney(r.totalCents) },
          { key: "createdAt", header: "Date", render: (r) => formatDate(r.createdAt) }
        ]}
      />
    </>
  );
}
