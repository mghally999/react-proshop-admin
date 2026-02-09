import { useMemo } from "react";
import s from "./DataTable.module.css";
import Button from "../../primitives/Button.jsx";

function sortRows(rows, sort, columns) {
  if (!sort) return rows;

  const col = columns.find((c) => c.key === sort.key);
  const getVal =
    col?.accessor ||
    ((row) => {
      const v = row?.[sort.key];
      return v ?? "";
    });

  const dir = sort.dir === "desc" ? -1 : 1;

  // O(n log n) sort
  return [...rows].sort((a, b) => {
    const av = getVal(a);
    const bv = getVal(b);

    if (av === bv) return 0;
    if (av == null) return -1 * dir;
    if (bv == null) return 1 * dir;

    // numbers
    if (typeof av === "number" && typeof bv === "number")
      return (av - bv) * dir;

    // dates
    const ad = av instanceof Date ? av.getTime() : Date.parse(av);
    const bd = bv instanceof Date ? bv.getTime() : Date.parse(bv);
    if (!Number.isNaN(ad) && !Number.isNaN(bd)) return (ad - bd) * dir;

    // strings
    return String(av).localeCompare(String(bv)) * dir;
  });
}

export default function DataTable({
  columns,
  rows,
  loading = false,
  emptyTitle = "No results",
  emptyHint = "Try adjusting filters.",
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  sort,
  onSortToggle,
  rowKey = (row) => row?.id,
  renderRowActions,
}) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const safeTotal = typeof total === "number" ? total : safeRows.length;

  const computed = useMemo(() => {
    const sorted = sortRows(safeRows, sort, columns);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      pageRows: sorted.slice(start, end), // O(k)
      pages: Math.max(1, Math.ceil(safeTotal / pageSize)),
    };
  }, [columns, page, pageSize, safeRows, safeTotal, sort]);

  const canPrev = page > 1;
  const canNext = page < computed.pages;

  return (
    <div className={s.card}>
      <div className={s.tableWrap} role="region" aria-label="Data table">
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              {columns.map((c) => {
                const isActiveSort = sort?.key === c.key;
                const sortDir = isActiveSort ? sort?.dir : null;

                return (
                  <th
                    key={c.key}
                    className={s.th}
                    style={{ width: c.width }}
                    data-align={c.align || "left"}
                  >
                    <button
                      type="button"
                      className={`${s.thBtn} ${c.sortable ? s.sortable : ""}`}
                      onClick={
                        c.sortable ? () => onSortToggle?.(c.key) : undefined
                      }
                      aria-label={
                        c.sortable ? `Sort by ${c.header}` : undefined
                      }
                    >
                      <span>{c.header}</span>
                      {c.sortable && (
                        <span
                          className={s.sortIcon}
                          data-dir={sortDir || "none"}
                        >
                          ▲
                        </span>
                      )}
                    </button>
                  </th>
                );
              })}
              {renderRowActions ? (
                <th className={s.thActions}>Actions</th>
              ) : null}
            </tr>
          </thead>

          <tbody className={s.tbody}>
            {loading ? (
              <tr>
                <td
                  className={s.stateCell}
                  colSpan={columns.length + (renderRowActions ? 1 : 0)}
                >
                  <div className={s.loading}>Loading…</div>
                </td>
              </tr>
            ) : computed.pageRows.length === 0 ? (
              <tr>
                <td
                  className={s.stateCell}
                  colSpan={columns.length + (renderRowActions ? 1 : 0)}
                >
                  <div className={s.empty}>
                    <div className={s.emptyTitle}>{emptyTitle}</div>
                    <div className={s.emptyHint}>{emptyHint}</div>
                  </div>
                </td>
              </tr>
            ) : (
              computed.pageRows.map((row) => (
                <tr key={rowKey(row)} className={s.tr}>
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={s.td}
                      data-align={c.align || "left"}
                    >
                      {c.render ? c.render(row) : String(row?.[c.key] ?? "")}
                    </td>
                  ))}
                  {renderRowActions ? (
                    <td className={s.tdActions}>{renderRowActions(row)}</td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={s.footer}>
        <div className={s.pagerLeft}>
          <span className={s.meta}>
            Page <b>{page}</b> of <b>{computed.pages}</b>
          </span>
          <span className={s.meta}>
            Total: <b>{safeTotal}</b>
          </span>
        </div>

        <div className={s.pagerRight}>
          <label className={s.pageSize}>
            <span>Rows</span>
            <select
              className={s.select}
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <div className={s.pagerBtns}>
            <Button
              variant="ghost"
              disabled={!canPrev}
              onClick={() => onPageChange?.(page - 1)}
            >
              Prev
            </Button>
            <Button
              variant="ghost"
              disabled={!canNext}
              onClick={() => onPageChange?.(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
