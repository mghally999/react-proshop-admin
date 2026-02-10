import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ProductForm from "../components/ProductForm.jsx";
import styles from "../styles/products.module.css";

import { useProductQuery } from "@proshop/products/api/products.queries.js";
import { useUpdateProductMutation } from "@proshop/products/api/products.mutations.js";
import { toFormDefaults } from "../../domain/product.logic.js";

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useProductQuery(id);
  const updateMut = useUpdateProductMutation();

  async function onSubmit(payload) {
    try {
      const updated = await updateMut.mutateAsync({ id, payload });
      toast.success("Saved");
      const nextId = updated?.id ?? updated?._id ?? id;
      navigate(`/proshop/products/${nextId}`);
    } catch (e) {
      toast.error(e?.response?.data?.message ?? e.message);
    }
  }

  if (isLoading) return <div className={styles.page}>Loading…</div>;

  if (isError) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          <div className={styles.errorTitle}>Failed to load product</div>
          <div className={styles.errorText}>
            {String(
              error?.response?.data?.message ??
                error?.message ??
                "Unknown error"
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Edit product</h1>
        </div>

        <button
          className={styles.ghostButton}
          type="button"
          onClick={() => navigate(`/proshop/products/${id}`)}
        >
          Back
        </button>
      </div>

      <ProductForm
        mode="edit"
        initialValues={toFormDefaults(data)}
        submitting={updateMut.isPending}
        onSubmit={onSubmit}
      />
    </div>
  );
}
