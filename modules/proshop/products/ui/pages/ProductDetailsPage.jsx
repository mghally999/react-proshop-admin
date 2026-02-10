import { useMemo } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useProductQuery } from "../../api/products.queries.js";
import PageHeader from "@/app/layout/PageHeader.jsx";
import Button from "@shared/ui/primitives/Button.jsx";
import { formatMoney, getStockStatusKey } from "../../domain/product.logic.js";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const nav = useNavigate();

  if (!id || id === "undefined") {
    return <Navigate to="/proshop/products" replace />;
  }

  const { data: product, isLoading, error } = useProductQuery(id);

  const stockKey = useMemo(
    () => getStockStatusKey(product?.stock),
    [product?.stock]
  );

  if (isLoading) {
    return (
      <>
        <PageHeader title="Product" subtitle="Loading…" />
        <div style={{ padding: 16 }}>Loading…</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader title="Product not found" subtitle={error.message} />
        <div style={{ padding: 16 }}>
          <Button onClick={() => nav("/proshop/products")}>Back</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={product?.name ?? "Product"}
        subtitle={`SKU: ${product?.sku ?? "—"} • Stock: ${stockKey}`}
        actions={
          <div style={{ display: "flex", gap: 10 }}>
            <Button onClick={() => nav(`/proshop/products/${id}/edit`)}>
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => nav(`/proshop/products/${id}/delete`)}
            >
              Delete
            </Button>
          </div>
        }
      />

      <div style={{ maxWidth: 900, padding: 16 }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <b>Category:</b> {product.category}
          </div>
          <div>
            <b>Status:</b> {product.status}
          </div>
          <div>
            <b>Type:</b> {product.productType}
          </div>
          <div>
            <b>Available:</b> {product.isAvailable ? "Yes" : "No"}
          </div>
          <div>
            <b>Price:</b> {formatMoney(product.priceCents, "AED")}
          </div>
          <div>
            <b>Cost:</b> {formatMoney(product.costCents, "AED")}
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <b>Description</b>
          <div style={{ opacity: 0.9 }}>{product.description || "—"}</div>
        </div>
      </div>
    </>
  );
}
