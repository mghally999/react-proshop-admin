import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ProductForm from "../components/ProductForm.jsx";
import styles from "../styles/products.module.css";

import { useCreateProductMutation } from "@proshop/products/api/products.mutations.js";
import { newProductDefaults } from "../../domain/product.logic.js";

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const createMut = useCreateProductMutation();

  async function onSubmit(payload) {
    try {
      const created = await createMut.mutateAsync(payload);
      const id = created?.id ?? created?._id;

      toast.success("Product created");

      if (!id) {
        toast.error("Create succeeded but API did not return product id");
        navigate("/proshop/products");
        return;
      }

      navigate(`/proshop/products/${id}`);
    } catch (e) {
      toast.error(e?.response?.data?.message ?? e.message);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Create product</h1>
        </div>

        <button
          className={styles.ghostButton}
          type="button"
          onClick={() => navigate("/proshop/products")}
        >
          Back
        </button>
      </div>

      <ProductForm
        mode="create"
        initialValues={newProductDefaults}
        submitting={createMut.isPending}
        onSubmit={onSubmit}
      />
    </div>
  );
}
