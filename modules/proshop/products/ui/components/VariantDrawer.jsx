import { useEffect, useMemo, useState } from "react";
import styles from "../styles/products.module.css";
import { variantSchema } from "../../domain/product.logic.js";
import { uid } from "@shared/lib/id.js";

function zodToFieldErrors(err) {
  const map = {};
  if (!err?.issues) return map;
  for (const issue of err.issues) {
    const key = issue.path?.[0] ?? "form";
    map[key] = issue.message;
  }
  return map;
}

function defaults(v) {
  return {
    id: v?.id ?? uid("v"),
    name: v?.name ?? "",
    sku: v?.sku ?? "",
    price: v?.price ?? "0",
    stock: v?.stock ?? "0",
    isAvailable: Boolean(v?.isAvailable ?? true),
  };
}

export default function VariantDrawer({ initial, onClose, onSave }) {
  const [values, setValues] = useState(() => defaults(initial));
  const [errors, setErrors] = useState({});

  const isEdit = useMemo(() => Boolean(initial?.id), [initial?.id]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function setField(name, val) {
    setValues((p) => ({ ...p, [name]: val }));
  }

  function validate(next) {
    const r = variantSchema.safeParse(next);
    if (!r.success) {
      setErrors(zodToFieldErrors(r.error));
      return false;
    }
    setErrors({});
    return true;
  }

  function submit() {
    const next = values;
    if (!validate(next)) return;
    onSave(next);
  }

  return (
    <div className={styles.drawerOverlay} onMouseDown={onClose}>
      <div
        className={styles.drawerPanel}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.drawerHeader}>
          <div>
            <div className={styles.drawerTitle}>
              {isEdit ? "Edit variant" : "Create variant"}
            </div>
            <div className={styles.drawerSubtitle}>
              Unique SKU + price + stock (US-02).
            </div>
          </div>

          <button type="button" className={styles.iconBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {errors.form ? <div className={styles.formError}>{errors.form}</div> : null}

        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Variant name</label>
            <input
              className={styles.input}
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="e.g., Size M / Red / 10oz"
            />
            {errors.name ? <div className={styles.fieldError}>{errors.name}</div> : null}
          </div>

          <div className={styles.fieldRow2}>
            <div className={styles.field}>
              <label className={styles.label}>SKU</label>
              <input
                className={styles.input}
                value={values.sku}
                onChange={(e) => setField("sku", e.target.value)}
                placeholder="e.g., GLOVE-M-001"
              />
              {errors.sku ? <div className={styles.fieldError}>{errors.sku}</div> : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Availability</label>
              <label className={styles.switchLabel}>
                <input
                  type="checkbox"
                  checked={values.isAvailable}
                  onChange={(e) => setField("isAvailable", e.target.checked)}
                />
                <span>{values.isAvailable ? "Available" : "Unavailable"}</span>
              </label>
            </div>
          </div>

          <div className={styles.fieldRow2}>
            <div className={styles.field}>
              <label className={styles.label}>Price</label>
              <input
                className={styles.input}
                value={values.price}
                onChange={(e) => setField("price", e.target.value)}
                inputMode="decimal"
                placeholder="0.00"
              />
              {errors.price ? <div className={styles.fieldError}>{errors.price}</div> : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Stock</label>
              <input
                className={styles.input}
                value={values.stock}
                onChange={(e) => setField("stock", e.target.value)}
                inputMode="numeric"
                placeholder="0"
              />
              {errors.stock ? <div className={styles.fieldError}>{errors.stock}</div> : null}
            </div>
          </div>
        </div>

        <div className={styles.drawerFooter}>
          <button type="button" className={styles.ghostBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.primaryBtn} onClick={submit}>
            {isEdit ? "Save variant" : "Create variant"}
          </button>
        </div>
      </div>
    </div>
  );
}
