// src/modules/proshop/products/ui/components/ProductForm.jsx
import { useEffect, useMemo, useState } from "react";
import styles from "../styles/products.module.css";
import { productSchema } from "../../domain/product.logic.js";
import VariantsEditor from "./VariantsEditor.jsx";

function zodToFieldErrors(err) {
  const map = {};
  if (!err?.issues) return map;
  for (const issue of err.issues) {
    const key = issue.path?.[0] ?? "form";
    map[key] = issue.message;
  }
  return map;
}

export default function ProductForm({ mode, initialValues, submitting, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const hasVariants = useMemo(
    () => Array.isArray(values?.variants) && values.variants.length > 0,
    [values?.variants]
  );

  function setField(name, val) {
    setValues((prev) => ({ ...prev, [name]: val }));
  }

  function validate(next) {
    const r = productSchema.safeParse(next);
    if (!r.success) {
      const fieldErrors = zodToFieldErrors(r.error);
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = values;
    if (!validate(next)) return;
    await onSubmit(next);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {errors.form ? <div className={styles.formError}>{errors.form}</div> : null}

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label className={styles.label}>Product name</label>
          <input
            className={styles.input}
            value={values?.name ?? ""}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="e.g., Golf Gloves"
          />
          {errors.name ? <div className={styles.fieldError}>{errors.name}</div> : null}
        </div>

        <div className={styles.fieldRow2}>
          <div className={styles.field}>
            <label className={styles.label}>SKU</label>
            <input
              className={styles.input}
              value={values?.sku ?? ""}
              onChange={(e) => setField("sku", e.target.value)}
              placeholder="e.g., GLOVE-001"
            />
            {errors.sku ? <div className={styles.fieldError}>{errors.sku}</div> : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <input
              className={styles.input}
              value={values?.category ?? ""}
              onChange={(e) => setField("category", e.target.value)}
              placeholder="e.g., Accessories"
            />
            {errors.category ? (
              <div className={styles.fieldError}>{errors.category}</div>
            ) : null}
          </div>
        </div>

        <div className={styles.fieldRow3}>
          <div className={styles.field}>
            <label className={styles.label}>Product type</label>
            <select
              className={styles.select}
              value={values?.productType ?? "sale"}
              onChange={(e) => setField("productType", e.target.value)}
            >
              <option value="sale">Sale</option>
              <option value="rental">Rental</option>
            </select>
            {errors.productType ? (
              <div className={styles.fieldError}>{errors.productType}</div>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Status</label>
            <select
              className={styles.select}
              value={values?.status ?? "draft"}
              onChange={(e) => setField("status", e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="rented">Rented</option>
              <option value="returned">Returned</option>
              <option value="archived">Archived</option>
            </select>
            {errors.status ? (
              <div className={styles.fieldError}>{errors.status}</div>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Availability</label>
            <label className={styles.switchLabel}>
              <input
                type="checkbox"
                checked={Boolean(values?.isAvailable)}
                onChange={(e) => setField("isAvailable", e.target.checked)}
              />
              <span>{values?.isAvailable ? "Available" : "Unavailable"}</span>
            </label>
            {errors.isAvailable ? (
              <div className={styles.fieldError}>{errors.isAvailable}</div>
            ) : null}
          </div>
        </div>

        <div className={styles.fieldRow3}>
          <div className={styles.field}>
            <label className={styles.label}>Price</label>
            <input
              className={styles.input}
              value={values?.price ?? "0"}
              onChange={(e) => setField("price", e.target.value)}
              inputMode="decimal"
              placeholder="0.00"
            />
            {errors.price ? (
              <div className={styles.fieldError}>{errors.price}</div>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Cost</label>
            <input
              className={styles.input}
              value={values?.cost ?? "0"}
              onChange={(e) => setField("cost", e.target.value)}
              inputMode="decimal"
              placeholder="0.00"
            />
            {errors.cost ? <div className={styles.fieldError}>{errors.cost}</div> : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Stock {hasVariants ? "(base stock)" : ""}
            </label>
            <input
              className={styles.input}
              value={values?.stock ?? "0"}
              onChange={(e) => setField("stock", e.target.value)}
              inputMode="numeric"
              placeholder="0"
            />
            {errors.stock ? (
              <div className={styles.fieldError}>{errors.stock}</div>
            ) : null}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={values?.description ?? ""}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Short description…"
            rows={4}
          />
          {errors.description ? (
            <div className={styles.fieldError}>{errors.description}</div>
          ) : null}
        </div>
      </div>

      <VariantsEditor
        value={values?.variants ?? []}
        onChange={(next) => setField("variants", next)}
      />
      {errors.variants ? (
        <div className={styles.formError}>{errors.variants}</div>
      ) : null}

      <div className={styles.formActions}>
        <button className={styles.primaryBtn} type="submit" disabled={submitting}>
          {submitting
            ? mode === "edit"
              ? "Saving…"
              : "Creating…"
            : mode === "edit"
            ? "Save changes"
            : "Create product"}
        </button>
      </div>
    </form>
  );
}
