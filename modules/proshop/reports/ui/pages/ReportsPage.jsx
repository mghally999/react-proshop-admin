import PageHeader from "../../../../../app/layout/PageHeader";
import DataTable from "../../../../../shared/ui/data/DataTable/DataTable";
import Skeleton from "../../../../../shared/ui/composites/Skeleton";
import EmptyState from "../../../../../shared/ui/composites/EmptyState";

import { useReports } from "../../../../proshop/reports/domain/api/reports.queries";

export default function ReportsPage() {
  const { data, isLoading } = useReports();

  if (isLoading) return <Skeleton rows={6} />;

  if (!data?.items?.length) {
    return (
      <>
        <PageHeader title="Reports" />
        <EmptyState
          title="No reports yet"
          description="Reports will be generated once transactions occur."
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Reports" />
      <DataTable
        rows={data.items}
        columns={[
          { key: "type", header: "Type" },
          { key: "period", header: "Period" },
          { key: "total", header: "Total" },
          { key: "createdAt", header: "Generated At" },
        ]}
      />
    </>
  );
}
