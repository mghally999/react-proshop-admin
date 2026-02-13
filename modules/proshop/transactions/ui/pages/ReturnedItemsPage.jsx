// src/modules/proshop/transactions/ui/pages/ReturnedItemsPage.jsx
import PageHeader from "@/app/layout/PageHeader.jsx";
import DataTable from "@shared/ui/data/DataTable/DataTable.jsx";

import { useTransactions } from "@modules/proshop/transactions/api/transactions.queries.js";

import { formatDate } from "@shared/lib/dates.js";
import { formatMoney } from "@modules/proshop/products/domain/product.logic.js";

export default function ReturnedItemsPage() {
  const { data, isLoading } = useTransactions({
    type: "rental",
    status: "returned",
    limit: 50,
  });

  return (
    <>
      <PageHeader title="Returned Items" subtitle="Completed rentals." />

      <DataTable
        loading={isLoading}
        rows={data?.items || []}
        page={1}
        pageSize={50}
        total={data?.meta?.total || 0}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        columns={[
          { key: "productName", header: "Product" },
          { key: "userName", header: "User" },
          {
            key: "totalCents",
            header: "Total",
            align: "right",
            render: (r) => formatMoney(r.totalCents),
          },
          {
            key: "createdAt",
            header: "Rented At",
            render: (r) => formatDate(r.createdAt),
          },
          {
            key: "returnedAt",
            header: "Returned At",
            render: (r) => formatDate(r.returnedAt),
          },
        ]}
      />
    </>
  );
}
