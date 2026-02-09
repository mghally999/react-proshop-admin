import { useNavigate, useParams } from "react-router-dom";
import { useProductQuery } from "@proshop/products/api/products.queries.js";
import { useDeleteProductMutation } from "@proshop/products/api/products.mutations.js";
import PageHeader from "@/app/layout/PageHeader.jsx";
import Button from "@shared/ui/primitives/Button.jsx";

export default function ProductDeletePage() {
  const { id } = useParams();
  const nav = useNavigate();

  const { data: product } = useProductQuery(id);
  const del = useDeleteProductMutation();

  async function onDelete() {
    await del.mutateAsync({ id });
    nav("/proshop/products");
  }

  return (
    <>
      <PageHeader title="Delete Product" subtitle="Soft delete (keeps history & reports)." />

      <div style={{ maxWidth: 700, padding: 16 }}>
        <div style={{ opacity: 0.85, marginBottom: 12 }}>
          Are you sure you want to delete:
          <div style={{ fontWeight: 800, marginTop: 6 }}>
            {product?.name || "Loading…"}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="ghost" onClick={() => nav(`/proshop/products/${id}`)}>
            Cancel
          </Button>
          <Button variant="danger" loading={del.isPending} onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </>
  );
}
