import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/products.module.css";
import { useProductQuery } from "../../api/products.queries";
import { formatMoney } from "../../../../proshop/products/domain/product.logic";
import { formatDate } from "../../../../../src/shared/lib/dates";

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: product, isLoading, isError, error } = useProductQuery(id);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>Loading…</div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h2 className={styles.h2}>Product not found</h2>
          <div className={styles.errorText}>
            {error?.message || "Product does not exist"}
          </div>
          <button
            className={styles.ghostBtn}
            onClick={() => navigate("/proshop/products")}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.actionsRow}>
          <button
            className={styles.ghostBtn}
            onClick={() => navigate("/proshop/products")}
          >
            Back
          </button>
          <button
            className={styles.primaryBtn}
            onClick={() => navigate(`/proshop/products/${id}/edit`)}
          >
            Edit
          </button>
        </div>

        <h2 className={styles.h2}>{product.name}</h2>

        <div className={styles.grid2}>
          <div className={styles.kv}>
            <div className={styles.k}>SKU</div>
            <div className={styles.v}>{product.sku || "-"}</div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>Category</div>
            <div className={styles.v}>{product.category || "-"}</div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>Price</div>
            <div className={styles.v}>
              {formatMoney(product.priceCents || product.price || 0)}
            </div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>Stock</div>
            <div className={styles.v}>
              {product.stock || product.stockQty || 0}
            </div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>Status</div>
            <div className={styles.v}>{product.status || "draft"}</div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>Updated</div>
            <div className={styles.v}>
              {product.updatedAt ? formatDate(product.updatedAt) : "-"}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Description</div>
          <div className={styles.sectionContent}>
            {product.description || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
