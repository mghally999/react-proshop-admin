import { useNavigate } from "react-router-dom";
import { formatMoney } from "@modules/proshop/products/domain/product.logic.js";
import { formatDate } from "@shared/lib/dates.js";
import styles from "../styles/products.module.css";

/* ------------------ Sorting Helpers ------------------ */

function nextSort(current, field) {
  const [curField, curDir] = String(current || "").split(":");
  if (curField !== field) return `${field}:asc`;
  return curDir === "asc" ? `${field}:desc` : `${field}:asc`;
}

function sortIcon(sort, field) {
  const [curField, curDir] = String(sort || "").split(":");
  if (curField !== field) return "↕";
  return curDir === "asc" ? "↑" : "↓";
}

/* ------------------ Component ------------------ */

export default function ProductTable({
  items = [],
  loading = false,
  page = 1,
  pages = 1,
  total = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  sort,
  onSortChange,
}) {
  const navigate = useNavigate();

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thLeft}>
                <button
                  type="button"
                  className={styles.sortBtn}
                  onClick={() => onSortChange?.(nextSort(sort, "name"))}
                >
                  Product{" "}
                  <span className={styles.sortIcon}>
                    {sortIcon(sort, "name")}
                  </span>
                </button>
              </th>

              <th className={styles.th}>Category</th>

              <th className={styles.th}>
                <button
                  type="button"
                  className={styles.sortBtn}
                  onClick={() => onSortChange?.(nextSort(sort, "priceCents"))}
                >
                  Price{" "}
                  <span className={styles.sortIcon}>
                    {sortIcon(sort, "priceCents")}
                  </span>
                </button>
              </th>

              <th className={styles.th}>
                <button
                  type="button"
                  className={styles.sortBtn}
                  onClick={() => onSortChange?.(nextSort(sort, "stock"))}
                >
                  Stock{" "}
                  <span className={styles.sortIcon}>
                    {sortIcon(sort, "stock")}
                  </span>
                </button>
              </th>

              <th className={styles.th}>Status</th>

              <th className={styles.th}>
                <button
                  type="button"
                  className={styles.sortBtn}
                  onClick={() => onSortChange?.(nextSort(sort, "updatedAt"))}
                >
                  Updated{" "}
                  <span className={styles.sortIcon}>
                    {sortIcon(sort, "updatedAt")}
                  </span>
                </button>
              </th>

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
              items.map((p) => {
                // ✅ Critical Fix: Support Mongo `_id`
                const productId = p._id ?? p.id;

                return (
                  <tr key={String(productId)} className={styles.tr}>
                    <td className={styles.tdLeft}>
                      <div className={styles.cellTitle}>{p.name}</div>
                      <div className={styles.cellSub}>
                        SKU: {p.sku || "—"}
                      </div>
                    </td>

                    <td className={styles.td}>
                      {p.category || "—"}
                    </td>

                    <td className={styles.td}>
                      {formatMoney(p.priceCents || 0)}
                    </td>

                    <td className={styles.td}>
                      {Number(p.stock ?? 0)}
                    </td>

                    <td className={styles.td}>
                      <span className={styles.statusPill}>
                        <span className={styles.statusDot} />
                        {p.status || "draft"}
                      </span>
                    </td>

                    <td className={styles.td}>
                      {p.updatedAt
                        ? formatDate(p.updatedAt)
                        : "—"}
                    </td>

                    <td className={styles.tdRight}>
                      <button
                        type="button"
                        className={styles.ghostButton}
                        onClick={() =>
                          navigate(`/proshop/products/${productId}`)
                        }
                      >
                        View
                      </button>

                      <button
                        type="button"
                        className={styles.outlineButton}
                        onClick={() =>
                          navigate(`/proshop/products/${productId}/edit`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className={styles.dangerBtn}
                        onClick={() =>
                          navigate(`/proshop/products/${productId}/delete`)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ------------------ Footer ------------------ */}

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
              onChange={(e) =>
                onPageSizeChange?.(Number(e.target.value))
              }
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
            onClick={() => onPageChange?.(page - 1)}
          >
            Prev
          </button>

          <button
            type="button"
            className={styles.ghostButton}
            disabled={page >= pages}
            onClick={() => onPageChange?.(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
