// src/modules/proshop/products/ui/components/ProductFilters.jsx
import styles from "../styles/products.module.css";

export default function ProductFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
}) {
  return (
    <div className={styles.filters}>
      <div className={styles.filterBlock}>
        <label className={styles.label}>Search</label>
        <input
          className={styles.input}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Name / SKU / Category…"
        />
      </div>

      <div className={styles.filterBlock}>
        <label className={styles.label}>Status</label>
        <select
          className={styles.select}
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className={styles.filterBlock}>
        <label className={styles.label}>Sort</label>
        <select
          className={styles.select}
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="updatedAt:desc">Recently updated</option>
          <option value="updatedAt:asc">Oldest updated</option>
          <option value="name:asc">Name A → Z</option>
          <option value="name:desc">Name Z → A</option>
          <option value="price:asc">Price low → high</option>
          <option value="price:desc">Price high → low</option>
          <option value="stock:asc">Stock low → high</option>
          <option value="stock:desc">Stock high → low</option>
        </select>
      </div>
    </div>
  );
}
