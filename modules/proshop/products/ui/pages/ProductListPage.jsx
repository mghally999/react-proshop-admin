// src/modules/proshop/products/ui/pages/ProductListPage.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDebounce } from "/shared/hooks/useDebounce.js";
import { useProductsListQuery } from "/modules/proshop/products/api/products.queries.js";

import ProductFilters from "/modules/proshop/products/ui/components/ProductFilters.jsx";
import ProductTable from "/modules/proshop/products/ui/components/ProductTable.jsx";

import styles from "../styles/products.module.css";
import { routesConfig } from "../../../../../app/router/routes.config";

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

  const { data, isLoading, isError, error } = useProductsListQuery(queryParams);

  const items = data?.items ?? [];
  const meta = data?.meta ?? { page: 1, pageSize, total: 0, pages: 1 };

  function onCreate(e) {
    navigate("/proshop/products/new");
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Products</h1>
          <p className={styles.subtitle}>
            Enterprise product management: fast, responsive, scalable.
          </p>
        </div>

        <button
          className={styles.primaryButton}
          type="button"
          onClick={onCreate}
        >
          Create product
        </button>
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
            {String(error?.message ?? "Unknown error")}
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
        />
      )}
    </div>
  );
}
