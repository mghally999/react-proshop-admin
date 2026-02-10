import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "../styles/products.module.css";

import { useProductQuery } from "@proshop/products/api/products.queries.js";
import { useDeleteProductMutation } from "@proshop/products/api/products.mutations.js";

export default function ProductDeletePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useProductQuery(id);
  const delMut = useDeleteProductMutation();

  async function onDelete() {
    try {
      await delMut.mutateAsync(id);
      toast.success("Deleted");
      navigate("/proshop/products");
    } catch (e) {
      toast.error(e?.response?.data?.message ?? e.message);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Delete product</h1>
          <div className={styles.smallMuted}>
            {isLoading ? "Loading…" : (data?.name ?? "")}
          </div>
        </div>

        <button
          className={styles.ghostButton}
          type="button"
          onClick={() => navigate(`/proshop/products/${id}`)}
        >
          Back
        </button>
      </div>

      <div className={styles.card}>
        <div style={{ marginBottom: 12 }}>
          This will permanently delete the product from your database.
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            className={styles.dangerBtn}
            type="button"
            onClick={onDelete}
            disabled={delMut.isPending}
          >
            {delMut.isPending ? "Deleting…" : "Confirm delete"}
          </button>

          <button
            className={styles.outlineButton}
            type="button"
            onClick={() => navigate(`/proshop/products/${id}`)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
