import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useDebounce } from "@shared/hooks/useDebounce.js";
import { useProductsQuery } from "@proshop/products/api/products.queries.js";
import { useImportFakeStoreMutation } from "@proshop/products/api/products.mutations.js";

import ProductFilters from "@proshop/products/ui/components/ProductFilters.jsx";
import ProductTable from "@proshop/products/ui/components/ProductTable.jsx";

import styles from "../styles/products.module.css";

export default function ProductListPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("updatedAt:desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const debouncedSearch = useDebounce(search, 250);

  const queryParams = useMemo(
    () => ({ page, pageSize, search: debouncedSearch, status, sort }),
    [page, pageSize, debouncedSearch, status, sort]
  );

  const { data, isLoading, isError, error } = useProductsQuery(queryParams);
  const importFs = useImportFakeStoreMutation();

  const items = data?.items ?? [];
  const meta = data?.meta ?? { page: 1, pageSize, total: 0, pages: 1 };

  async function onImportFakeStore() {
    try {
      const res = await importFs.mutateAsync();
      toast.success(
        `Imported ${res?.imported ?? 0} · Upserted ${res?.upserted ?? 0}`
      );
    } catch (e) {
      toast.error(e?.response?.data?.message ?? e.message);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Products</h1>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            className={styles.outlineButton}
            type="button"
            onClick={onImportFakeStore}
            disabled={importFs.isPending}
            title="Import FakeStore products into your DB"
          >
            {importFs.isPending ? "Importing…" : "Import FakeStore"}
          </button>

          <button
            className={styles.primaryButton}
            type="button"
            onClick={() => navigate("/proshop/products/new")}
          >
            Create product
          </button>
        </div>
      </div>

      <ProductFilters
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        status={status}
        onStatusChange={(v) => {
          setPage(1);
          setStatus(v);
        }}
        sort={sort}
        onSortChange={(v) => {
          setPage(1);
          setSort(v);
        }}
      />

      {isError ? (
        <div className={styles.errorBox}>
          <div className={styles.errorTitle}>Failed to load products</div>
          <div className={styles.errorText}>
            {String(
              error?.response?.data?.message ??
                error?.message ??
                "Unknown error"
            )}
          </div>
        </div>
      ) : (
        <ProductTable
          items={items}
          loading={isLoading}
          page={meta.page}
          pages={meta.pages}
          total={meta.total}
          pageSize={meta.pageSize}
          onPageChange={setPage}
          onPageSizeChange={(n) => {
            setPage(1);
            setPageSize(n);
          }}
          sort={sort}
          onSortChange={(v) => {
            setPage(1);
            setSort(v);
          }}
        />
      )}
    </div>
  );
}
