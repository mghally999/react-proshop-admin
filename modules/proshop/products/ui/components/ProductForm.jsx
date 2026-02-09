// src/modules/proshop/products/ui/components/ProductForm.jsx
import { useEffect, useMemo, useState } from "react";
import { productSchema } from "/modules/proshop/products/domain/product.logic.js";
import styles from "../styles/products.module.css";

function validate(values) {
  const res = productSchema.safeParse(values);
  if (res.success) return { ok: true, errors: {} };

  const errors = {};
  for (const issue of res.error.issues) {
    const key = issue.path?.[0];
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}

export default function ProductForm({
  mode,
  initialValues,
  submitting,
  onSubmit,
}) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initialValues);
    setTouched({});
    setErrors({});
  }, [initialValues]);

  const canSubmit = useMemo(() => {
    const v = validate(values);
    return v.ok;
  }, [values]);

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function onBlur(name) {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const v = validate(values);
    setErrors(v.errors);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate(values);
    setErrors(v.errors);
    setTouched({
      name: true,
      sku: true,
      category: true,
      price: true,
      stock: true,
      status: true,
    });

    if (!v.ok) return;
    await onSubmit(values);
  }

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            onBlur={() => onBlur("name")}
            placeholder="Product name"
          />
          {touched.name && errors.name ? (
            <div className={styles.fieldError}>{errors.name}</div>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>SKU</label>
          <input
            className={styles.input}
            value={values.sku}
            onChange={(e) => setField("sku", e.target.value)}
            onBlur={() => onBlur("sku")}
            placeholder="SKU"
          />
          {touched.sku && errors.sku ? (
            <div className={styles.fieldError}>{errors.sku}</div>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Category</label>
          <input
            className={styles.input}
            value={values.category}
            onChange={(e) => setField("category", e.target.value)}
            onBlur={() => onBlur("category")}
            placeholder="Category"
          />
          {touched.category && errors.category ? (
            <div className={styles.fieldError}>{errors.category}</div>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Price</label>
          <input
            className={styles.input}
            value={values.price}
            onChange={(e) => setField("price", e.target.value)}
            onBlur={() => onBlur("price")}
            placeholder="0.00"
            inputMode="decimal"
          />
          {touched.price && errors.price ? (
            <div className={styles.fieldError}>{errors.price}</div>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Stock</label>
          <input
            className={styles.input}
            value={values.stock}
            onChange={(e) => setField("stock", e.target.value)}
            onBlur={() => onBlur("stock")}
            placeholder="0"
            inputMode="numeric"
          />
          {touched.stock && errors.stock ? (
            <div className={styles.fieldError}>{errors.stock}</div>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select
            className={styles.select}
            value={values.status}
            onChange={(e) => setField("status", e.target.value)}
            onBlur={() => onBlur("status")}
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
          {touched.status && errors.status ? (
            <div className={styles.fieldError}>{errors.status}</div>
          ) : null}
        </div>
      </div>

      <div className={styles.formActions}>
        <button
          className={styles.primaryButton}
          type="submit"
          disabled={!canSubmit || submitting}
        >
          {submitting
            ? "Saving…"
            : mode === "create"
              ? "Create"
              : "Save changes"}
        </button>
      </div>
    </form>
  );
}
