// src/modules/proshop/transactions/ui/components/SellRentDrawer.jsx

import { useMemo, useState } from "react";
import { Drawer } from "@shared/ui/composites/Drawer.jsx";
import Button from "@shared/ui/primitives/Button.jsx";
import Select from "@shared/ui/primitives/Select.jsx";
import Input from "@shared/ui/primitives/Input.jsx";

import { useCreateTransaction } from "@proshop/transactions/api/transactions.mutations.js";
import { useProductsQuery } from "@proshop/products/api/products.queries.js";
import { useUsers } from "@shared/api/users/users.queries.js";

import { formatMoney } from "@proshop/products/domain/product.logic.js";

function toCents(v) {
  return Math.round(Number(v || 0) * 100);
}

export default function SellRentDrawer({ open, onClose }) {
  const [productId, setProductId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [userId, setUserId] = useState("");
  const [qty, setQty] = useState(1);
  const [duration, setDuration] = useState(1);
  const [overrideTotal, setOverrideTotal] = useState("");

  const tx = useCreateTransaction();

  const { data: productsData } = useProductsQuery({
    page: 1,
    pageSize: 200,
  });

  const { data: usersData } = useUsers();

  const products = productsData?.items || [];

  const users = (usersData?.items || usersData || []).map((u) => {
    const id = u._id || u.id;

    const fullName =
      typeof u.name === "string"
        ? u.name
        : u.name?.firstname
        ? `${u.name.firstname} ${u.name.lastname || ""}`
        : "Unnamed";

    return {
      id,
      label: `${fullName} (${u.email || "no-email"})`,
    };
  });

  const selectedProduct = useMemo(
    () => products.find((p) => String(p._id || p.id) === productId) || null,
    [products, productId]
  );

  const variants = selectedProduct?.variants || [];
  const hasVariants = variants.length > 0;

  const type = selectedProduct?.productType === "rental" ? "rental" : "sale";

  async function submit() {
    if (!selectedProduct || !userId) return;

    await tx.mutateAsync({
      type,
      productId: selectedProduct._id || selectedProduct.id,
      variantId: hasVariants ? variantId || null : null,
      userId,
      quantity: type === "sale" ? Number(qty) : 1,
      rental:
        type === "rental"
          ? { duration: Number(duration) }
          : null,
      overrideTotalCents:
        overrideTotal !== "" ? toCents(overrideTotal) : null,
    });

    onClose();
    setProductId("");
    setVariantId("");
    setUserId("");
    setQty(1);
    setDuration(1);
    setOverrideTotal("");
  }

  return (
    <Drawer open={open} onClose={onClose} title="Sell / Rent Product">
      <Select
        label="User"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        options={[
          { value: "", label: "Select user…" },
          ...users.map((u) => ({
            value: u.id,
            label: u.label,
          })),
        ]}
      />

      <Select
        label="Product"
        value={productId}
        onChange={(e) => {
          setProductId(e.target.value);
          setVariantId("");
        }}
        options={[
          { value: "", label: "Select product…" },
          ...products.map((p) => ({
            value: p._id || p.id,
            label: `${p.name} • ${p.productType}`,
          })),
        ]}
      />

      {selectedProduct && type === "sale" && (
        <Input
          label="Quantity"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
      )}

      {selectedProduct && type === "rental" && (
        <Input
          label="Duration"
          type="number"
          min={1}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      )}

      <Input
        label="Override Total (AED)"
        type="number"
        value={overrideTotal}
        onChange={(e) => setOverrideTotal(e.target.value)}
      />

      <Button
        variant="primary"
        onClick={submit}
        loading={tx.isPending}
        disabled={!productId || !userId}
      >
        Confirm {type === "rental" ? "Rental" : "Sale"}
      </Button>
    </Drawer>
  );
}
