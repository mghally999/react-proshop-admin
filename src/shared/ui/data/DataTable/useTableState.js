import { useMemo, useState } from "react";

export function useTableState({
  initialPageSize = 10,
  initialSort = null,
} = {}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sort, setSort] = useState(initialSort); // { key, dir: "asc" | "desc" } | null

  const actions = useMemo(
    () => ({
      setPage,
      setPageSize: (n) => {
        setPage(1);
        setPageSize(n);
      },
      toggleSort: (key) => {
        setPage(1);
        setSort((prev) => {
          if (!prev || prev.key !== key) return { key, dir: "asc" };
          if (prev.dir === "asc") return { key, dir: "desc" };
          return null;
        });
      },
      reset: () => {
        setPage(1);
        setSort(initialSort);
        setPageSize(initialPageSize);
      },
    }),
    [initialPageSize, initialSort]
  );

  return { page, pageSize, sort, actions };
}
