import { useNavigate } from "react-router-dom";

import { routesConfig } from "../../../../../app/router/routes.config";
import { formatMoney } from "/modules/proshop/products/domain/product.logic.js";
import { formatDate } from "/shared/lib/dates.js";

import styles from "../styles/products.module.css";

export default function ProductTable({
  items,
  loading,
  page,
  pages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
  const navigate = useNavigate();

  // REMOVED: onClick={() => navigate(`products/:${p.id}/view`)}
  // KEPT: ROUTES.productDetails(p.id)

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thLeft}>Product</th>
              <th className={styles.th}>Category</th>
              <th className={styles.th}>Price</th>
              <th className={styles.th}>Stock</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Updated</th>
              <th className={styles.thRight}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className={styles.td} colSpan={7}>
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td className={styles.td} colSpan={7}>
                  No products
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.id} className={styles.tr}>
                  <td className={styles.tdLeft}>
                    <div className={styles.cellTitle}>{p.name}</div>
                    <div className={styles.cellSub}>SKU: {p.sku}</div>
                  </td>
                  <td className={styles.td}>{p.category}</td>
                  <td className={styles.td}>{formatMoney(p.priceCents)}</td>
                  <td className={styles.td}>{p.stock}</td>
                  <td className={styles.td}>
                    <span className={styles.pill}>{p.status}</span>
                  </td>
                  <td className={styles.td}>{formatDate(p.updatedAt)}</td>
                  <td className={styles.tdRight}>
                    <button
                      type="button"
                      className={styles.ghostButton}
                      onClick={() => navigate(`/proshop/products/${p.id}`)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className={styles.outlineButton}
                      onClick={() => navigate(`/proshop/products/${p.id}/edit`)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.tableFooter}>
        <div className={styles.footerLeft}>
          Page {page} of {pages} · Total: {total}
        </div>

        <div className={styles.footerRight}>
          <div className={styles.rowsControl}>
            <span className={styles.smallMuted}>Rows</span>
            <select
              className={styles.selectSmall}
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <button
            type="button"
            className={styles.ghostButton}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Prev
          </button>

          <button
            type="button"
            className={styles.ghostButton}
            disabled={page >= pages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
