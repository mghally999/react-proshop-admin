import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/products.module.css";

import { useProductQuery } from "@proshop/products/api/products.queries.js";
import { formatMoney } from "../../domain/product.logic.js";
import { formatDate } from "@shared/lib/dates.js";

export default function ProductViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useProductQuery(id);

  if (isLoading) return <div className={styles.page}>Loading…</div>;

  if (isError) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          <div className={styles.errorTitle}>Product not found</div>
          <div className={styles.errorText}>
            {String(
              error?.response?.data?.message ??
                error?.message ??
                "Unknown error"
            )}
          </div>
          <button
            className={styles.ghostButton}
            type="button"
            onClick={() => navigate("/proshop/products")}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const p = data;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{p.name}</h1>
          <div className={styles.smallMuted}>SKU: {p.sku}</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            className={styles.outlineButton}
            type="button"
            onClick={() => navigate(`/proshop/products/${id}/edit`)}
          >
            Edit
          </button>
          <button
            className={styles.dangerBtn}
            type="button"
            onClick={() => navigate(`/proshop/products/${id}/delete`)}
          >
            Delete
          </button>
          <button
            className={styles.ghostButton}
            type="button"
            onClick={() => navigate("/proshop/products")}
          >
            Back
          </button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.kvGrid}>
          <div>
            <div className={styles.k}>Category</div>
            <div className={styles.v}>{p.category || "-"}</div>
          </div>

          <div>
            <div className={styles.k}>Price</div>
            <div className={styles.v}>{formatMoney(p.priceCents)}</div>
          </div>

          <div>
            <div className={styles.k}>Stock</div>
            <div className={styles.v}>{p.stock}</div>
          </div>

          <div>
            <div className={styles.k}>Status</div>
            <div className={styles.v}>{p.status}</div>
          </div>

          <div>
            <div className={styles.k}>Updated</div>
            <div className={styles.v}>{formatDate(p.updatedAt)}</div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div className={styles.k}>Description</div>
          <div className={styles.v}>{p.description || "-"}</div>
        </div>
      </div>
    </div>
  );
}
