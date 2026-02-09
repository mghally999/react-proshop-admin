import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useProductQuery } from "@proshop/products/api/products.queries.js";
import { useUpdateProductMutation } from "@proshop/products/api/products.mutations.js";
import {
  toFormDefaults,
  toProductPayload,
} from "@proshop/products/domain/product.logic.js";

import { toastError, toastSuccess } from "@shared/ui/feedback/Toast.jsx";

import ProductForm from "@proshop/products/ui/components/ProductForm.jsx";
import styles from "../styles/products.module.css";

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, isError, error } = useProductQuery(id);
  const updateMut = useUpdateProductMutation();

  const defaults = useMemo(() => toFormDefaults(data), [data]);

  async function handleSubmit(values) {
    try {
      const payload = toProductPayload(values);
      await updateMut.mutateAsync({ id, payload });
      toastSuccess("Product updated");
      navigate(`/proshop/products/${id}`);
    } catch (e) {
      toastError(e?.message ?? "Failed to update product");
    }
  }

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>Loading…</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          <div className={styles.errorTitle}>Product not found</div>
          <div className={styles.errorText}>
            {String(error?.message ?? "")}
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
          <p className={styles.subtitle}>
            {data.name} · {data.sku}
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() => navigate(`/proshop/products/${id}`)}
          >
            Cancel
          </button>
        </div>
      </div>

      <ProductForm
        mode="edit"
        initialValues={defaults}
        submitting={updateMut.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
