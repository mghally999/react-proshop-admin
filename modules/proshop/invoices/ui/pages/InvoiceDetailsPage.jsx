// modules/proshop/invoices/ui/pages/InvoiceDetailsPage.jsx
import { useParams } from "react-router-dom";

import PageHeader from "@/app/layout/PageHeader.jsx";

import Skeleton from "@shared/ui/composites/Skeleton.jsx";
import EmptyState from "@shared/ui/composites/EmptyState.jsx";
import Badge from "@shared/ui/primitives/Badge.jsx";

import { useInvoice } from "@proshop/invoices/api/invoices.queries.js";
import { formatMoney } from "@shared/lib/money.js";
import { formatDate } from "@shared/lib/dates.js";

import styles from "../styles/invoices.module.css";

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const { data: invoice, isLoading } = useInvoice(id);

  if (isLoading) return <Skeleton rows={4} />;

  if (!invoice) {
    return (
      <>
        <PageHeader title="Invoice" />
        <EmptyState
          title="Invoice not found"
          description="The requested invoice does not exist or was removed."
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`Invoice #${invoice.id.slice(0, 8)}`}
        meta={`Issued on ${formatDate(invoice.createdAt)}`}
        actions={
          <Badge tone={invoice.status === "paid" ? "success" : "warning"}>
            {invoice.status}
          </Badge>
        }
      />

      <section className={styles.invoice}>
        <div className={styles.row}>
          <span>Transaction Type</span>
          <strong>{invoice.type}</strong>
        </div>

        <div className={styles.row}>
          <span>Product</span>
          <strong>{invoice.productName}</strong>
        </div>

        {invoice.duration ? (
          <div className={styles.row}>
            <span>Rental Duration</span>
            <strong>{invoice.duration} days</strong>
          </div>
        ) : null}

        <div className={styles.total}>
          <span>Total</span>
          <strong>{formatMoney(invoice.total)}</strong>
        </div>
      </section>
    </>
  );
}
