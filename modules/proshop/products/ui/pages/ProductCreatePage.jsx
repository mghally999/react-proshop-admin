import { useNavigate } from "react-router-dom";

import { routesConfig } from "/app/router/routes.config.jsx";
import { useCreateProductMutation } from "/modules/proshop/products/api/products.mutations.js";
import {
  toProductPayload,
  toFormDefaults,
} from "/modules/proshop/products/domain/product.logic.js";
import { toastError, toastSuccess } from "/shared/ui/feedback/Toast.jsx";

import ProductForm from "/modules/proshop/products/ui/components/ProductForm.jsx";
import styles from "../styles/products.module.css";

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const createMut = useCreateProductMutation();

  async function handleSubmit(values) {
    try {
      const payload = toProductPayload(values);
      const created = await createMut.mutateAsync(payload);
      toastSuccess("Product created");
      navigate(`/proshop/products/${created.id}`); // FIXED
    } catch (e) {
      toastError(e?.message ?? "Failed to create product");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Create product</h1>
          <p className={styles.subtitle}>
            Add a new product (mock now, API later).
          </p>
        </div>
        <button
          className={styles.secondaryButton}
          type="button"
          onClick={() => navigate("/proshop/products")} // FIXED
        >
          Back
        </button>
      </div>

      <ProductForm
        mode="create"
        initialValues={toFormDefaults(null)}
        submitting={createMut.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
