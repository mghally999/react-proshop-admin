import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/products.module.css";
import { useProductByIdQuery } from "../api/products.queries";

function money(n) {
  const num = Number(n);
  if (Number.isNaN(num)) return "-";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export default function ProductViewPage({ id }) {
  const nav = useNavigate();
  const { id } = useParams();

  const { data: product, isLoading } = useProductByIdQuery(id);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>Loading…</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <h2 className={styles.h2}>Product not found</h2>
          <button className={styles.ghostBtn} onClick={() => nav("/products")}>
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
          <button className={styles.ghostBtn} onClick={() => nav("/products")}>
            Back
          </button>
          <button
            className={styles.primaryBtn}
            onClick={() => nav(`/products/${id}/edit`)}
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
            <div className={styles.v}>{money(product.price)}</div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>Stock</div>
            <div className={styles.v}>{product.stockQty ?? 0}</div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>Status</div>
            <div className={styles.v}>{product.status || "draft"}</div>
          </div>
          <div className={styles.kv}>
            <div className={styles.k}>Updated</div>
            <div className={styles.v}>{product.updatedAt || "-"}</div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.k}>Description</div>
          <div className={styles.v}>{product.description || "—"}</div>
        </div>
      </div>
    </div>
  );
}
