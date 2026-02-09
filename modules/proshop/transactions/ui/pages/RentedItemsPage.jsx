// src/modules/proshop/transactions/ui/pages/RentedItemsPage.jsx
import PageHeader from "@/app/layout/PageHeader.jsx";
import DataTable from "@shared/ui/data/DataTable/DataTable.jsx";
import Button from "@shared/ui/primitives/Button.jsx";

import { useTransactions } from "@modules/proshop/transactions/api/transactions.queries.js";
import { useReturnRental } from "@modules/proshop/transactions/api/transactions.mutations.js";

import { formatMoney } from "@modules/proshop/products/domain/product.logic.js";
import { formatDate } from "@shared/lib/dates.js";

export default function RentedItemsPage() {
  const { data, isLoading } = useTransactions({ type: "rent", status: "rented" });
  const ret = useReturnRental();

  return (
    <>
      <PageHeader
        title="Rented Items"
        subtitle="Active rentals waiting to be returned."
      />

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
          { key: "duration", header: "Duration" },
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
        ]}
        renderRowActions={(row) => (
          <Button
            variant="primary"
            loading={ret.isPending && ret.variables?.id === row.id}
            onClick={() => ret.mutate({ id: row.id })}
          >
            Mark Returned
          </Button>
        )}
      />
    </>
  );
}
