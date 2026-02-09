import PageHeader from "../../../../../app/layout/PageHeader";
import DataTable from "../../../../../shared/ui/data/DataTable/DataTable";
import Skeleton from "../../../../../shared//ui/composites/Skeleton";
import EmptyState from "../../../../../shared/ui/composites/EmptyState";
import Button from "../../../../../shared/ui/primitives/Button";

import { useReports } from "../../../../proshop/reports/domain/api/reports.queries";

export default function ReportsPage() {
  const { data, isLoading } = useReports();

  return (
    <>
      <PageHeader
        title="Reports"
        actions={<Button variant="secondary">Export</Button>}
      />

      {isLoading ? (
        <Skeleton rows={6} />
      ) : !data?.items?.length ? (
        <EmptyState
          title="No reports available"
          description="Reports will appear once transactions are recorded."
        />
      ) : (
        <DataTable
          rows={data.items}
          columns={[
            { key: "type", header: "Type" },
            { key: "period", header: "Period" },
            { key: "total", header: "Total Amount" },
            { key: "createdAt", header: "Generated At" },
          ]}
        />
      )}
    </>
  );
}
