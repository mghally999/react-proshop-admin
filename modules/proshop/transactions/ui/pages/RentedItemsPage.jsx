import PageHeader from "../../../../../app/layout/PageHeader";
import DataTable from "../../../../../shared/ui/data/DataTable/DataTable";
import { useTransactions } from "../../api/transactions.queries";

export default function RentedItemsPage() {
  const { data, isLoading } = useTransactions({ type: "rent" });

  return (
    <>
      <PageHeader title="Rented Items" />
      <DataTable
        loading={isLoading}
        rows={data?.items || []}
        columns={[
          { key: "productName", header: "Product" },
          { key: "rentPrice", header: "Price / Day" },
          { key: "duration", header: "Days" },
        ]}
      />
    </>
  );
}
