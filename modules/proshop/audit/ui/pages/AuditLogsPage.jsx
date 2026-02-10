import PageHeader from "@/app/layout/PageHeader.jsx";
import DataTable from "@shared/ui/data/DataTable/DataTable";
import Skeleton from "@shared/ui/composites/Skeleton";
import EmptyState from "@shared/ui/composites/EmptyState";

import { useAuditLogs } from "@proshop/audit/api/audit.queries";

export default function AuditLogsPage() {
  const { data, isLoading } = useAuditLogs();

  if (isLoading) return <Skeleton rows={6} />;

  if (!data?.items?.length) {
    return (
      <>
        <PageHeader title="Audit Logs" />
        <EmptyState
          title="No activity yet"
          description="All actions in the system will appear here."
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Audit Logs" />
      <DataTable
        rows={data.items}
        columns={[
          { key: "action", header: "Action" },
          { key: "entity", header: "Entity" },
          { key: "user", header: "User" },
          { key: "createdAt", header: "Timestamp" },
        ]}
      />
    </>
  );
}
