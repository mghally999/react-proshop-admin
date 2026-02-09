import PageHeader from "../../../../../app/layout/PageHeader";
import DataTable from "../../../../../shared/ui/data/DataTable/DataTable";
import { useTransactions } from "../../api/transactions.queries";

export default function SoldItemsPage() {
  const { data, isLoading } = useTransactions({ type: "sale" });

  return (
    <>
      <PageHeader title="Sold Items" />
      <DataTable
        loading={isLoading}
        rows={data?.items || []}
        columns={[
          { key: "productName", header: "Product" },
          { key: "price", header: "Price" },
          { key: "createdAt", header: "Date" },
        ]}
      />
    </>
  );
}
