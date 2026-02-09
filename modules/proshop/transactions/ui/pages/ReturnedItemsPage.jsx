import PageHeader from "../../../../../app/layout/PageHeader";
import DataTable from "../../../../../shared/ui/data/DataTable/DataTable";
import { useTransactions } from "../../api/transactions.queries";

export default function ReturnedItemsPage() {
  const { data, isLoading } = useTransactions({ status: "returned" });

  return (
    <>
      <PageHeader title="Returned Items" />
      <DataTable
        loading={isLoading}
        rows={data?.items || []}
        columns={[
          { key: "productName", header: "Product" },
          { key: "returnedAt", header: "Returned At" },
        ]}
      />
    </>
  );
}
