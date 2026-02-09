// src/modules/proshop/reports/ui/pages/ReportsPage.jsx

import PageHeader from "@/app/layout/PageHeader.jsx";

import DataTable from "@shared/ui/data/DataTable/DataTable.jsx";
import Skeleton from "@shared/ui/composites/Skeleton.jsx";
import EmptyState from "@shared/ui/composites/EmptyState.jsx";

import { useReports } from "@proshop/reports/domain/api/reports.queries";

export default function ReportsPage() {
  const { data, isLoading } = useReports();

  if (isLoading) {
    return <Skeleton rows={6} />;
  }

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
