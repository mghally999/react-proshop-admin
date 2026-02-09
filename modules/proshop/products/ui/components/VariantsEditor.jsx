import { useMemo, useState } from "react";
import styles from "../styles/products.module.css";
import VariantDrawer from "./VariantDrawer.jsx";
import { formatMoney } from "../../domain/product.logic.js";

export default function VariantsEditor({ value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const items = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(v) {
    setEditing(v);
    setOpen(true);
  }

  function removeVariant(id) {
    if (!window.confirm("Delete this variant?")) return;
    onChange(items.filter((x) => x.id !== id));
  }

  function saveVariant(next) {
    // upsert
    const exists = items.some((x) => x.id === next.id);
    const updated = exists
      ? items.map((x) => (x.id === next.id ? next : x))
      : [next, ...items];

    onChange(updated);
    setOpen(false);
    setEditing(null);
  }

  return (
    <div className={styles.variantsBox}>
      <div className={styles.variantsHeader}>
        <div>
          <div className={styles.sectionTitle}>Variants</div>
          <div className={styles.sectionHint}>
            Optional. Each variant has its own SKU, price, and stock (US-02).
          </div>
        </div>

        <button type="button" className={styles.primaryBtn} onClick={openCreate}>
          + Add variant
        </button>
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyBox}>
          No variants yet. Add variants for sizes/colors or different options.
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Variant</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Availability</th>
                <th className={styles.thRight}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((v) => (
                <tr key={v.id} className={styles.tr}>
                  <td className={styles.tdLeft}>
                    <div className={styles.cellTitle}>{v.name}</div>
                  </td>
                  <td className={styles.td}>
                    <span style={{ fontFamily: "var(--mono)" }}>{v.sku}</span>
                  </td>
                  <td className={styles.td}>
                    {formatMoney(Math.round(Number(v.price || 0) * 100))}
                  </td>
                  <td className={styles.td}>{v.stock}</td>
                  <td className={styles.td}>
                    {v.isAvailable ? "Available" : "Unavailable"}
                  </td>
                  <td className={styles.tdRight}>
                    <button
                      type="button"
                      className={styles.outlineButton}
                      onClick={() => openEdit(v)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={styles.dangerBtn}
                      onClick={() => removeVariant(v.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open ? (
        <VariantDrawer
          initial={editing}
          onClose={() => {
            setOpen(false);
            setEditing(null);
          }}
          onSave={saveVariant}
        />
      ) : null}
    </div>
  );
}
