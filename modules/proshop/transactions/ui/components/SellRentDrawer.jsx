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
  const n = Number(v ?? 0);
  return Math.round(n * 100);
}

function computeSaleUnitPriceCents(p, variantId) {
  const v = (p.variants || []).find((x) => String(x.id) === String(variantId));
  return Number(v?.priceCents ?? p.priceCents ?? 0);
}

function computeRentalTotalCents(p, variantId, duration) {
  const v = (p.variants || []).find((x) => String(x.id) === String(variantId));
  const r = v?.rental || p.rental;
  if (!r) return 0;

  const d = Math.max(1, Number(duration || 1));
  const flat = Number(r.flatRateCents || 0);
  const deposit = Number(r.depositCents || 0);
  const rate = Number(r.rateCents || 0);

  return (flat > 0 ? flat : rate * d) + deposit;
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
    search: "",
    status: "active",
    inv: "all",
    sort: "updatedAt:desc",
  });

  const { data: usersData } = useUsers();

  const products = productsData?.items || [];
  const users = usersData?.items || [];

  const selectedProduct = useMemo(
    () => products.find((p) => String(p.id) === String(productId)) || null,
    [products, productId]
  );

  const variants = selectedProduct?.variants || [];
  const hasVariants = variants.length > 0;

  const selectedVariant = useMemo(() => {
    if (!selectedProduct || !variantId) return null;
    return variants.find((v) => String(v.id) === String(variantId)) || null;
  }, [selectedProduct, variantId, variants]);

  const type = selectedProduct?.productType === "rental" ? "rent" : "sale";

  const previewTotalCents = useMemo(() => {
    if (!selectedProduct) return 0;

    if (type === "sale") {
      const unit = computeSaleUnitPriceCents(
        selectedProduct,
        hasVariants ? variantId : null
      );
      return unit * Math.max(1, Number(qty || 1));
    }

    return computeRentalTotalCents(
      selectedProduct,
      hasVariants ? variantId : null,
      duration
    );
  }, [selectedProduct, type, qty, duration, variantId, hasVariants]);

  const effectiveTotalCents =
    overrideTotal !== "" ? toCents(overrideTotal) : previewTotalCents;

  async function submit() {
    if (!selectedProduct || !userId) return;

    await tx.mutateAsync({
      type,
      productId: selectedProduct.id,
      variantId: hasVariants ? variantId || null : null,
      userId,
      qty: type === "sale" ? Math.max(1, Number(qty || 1)) : 1,
      duration: type === "rent" ? Math.max(1, Number(duration || 1)) : null,
      overrideTotalCents: overrideTotal !== "" ? toCents(overrideTotal) : null,
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
            label: `${u.name} (${u.email})`,
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
            value: p.id,
            label: `${p.name} • ${
              p.productType === "rental" ? "Rental" : "Sale"
            } • Stock: ${p.stock}`,
          })),
        ]}
      />

      {selectedProduct && hasVariants && (
        <Select
          label="Variant"
          value={variantId}
          onChange={(e) => setVariantId(e.target.value)}
          options={[
            { value: "", label: "Select variant…" },
            ...variants.map((v) => ({
              value: v.id,
              label: `${v.name} • SKU: ${v.sku} • Stock: ${v.stock}`,
            })),
          ]}
        />
      )}

      {selectedProduct && type === "sale" && (
        <Input
          label="Quantity"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />
      )}

      {selectedProduct && type === "rent" && (
        <>
          <Input
            label={`Duration (${
              selectedVariant?.rental?.unit ||
              selectedProduct?.rental?.unit ||
              "day"
            }s)`}
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
          <div style={{ fontSize: 12, opacity: 0.75 }}>
            Includes deposit if configured.
          </div>
        </>
      )}

      <Input
        label="Override Total (AED)"
        type="number"
        value={overrideTotal}
        onChange={(e) => setOverrideTotal(e.target.value)}
        placeholder="Leave empty to use computed price"
      />

      <div style={{ fontSize: 13 }}>
        Preview: <b>{formatMoney(previewTotalCents)}</b>
        <br />
        Final: <b>{formatMoney(effectiveTotalCents)}</b>
      </div>

      <Button
        variant="primary"
        onClick={submit}
        loading={tx.isPending}
        disabled={!productId || !userId}
      >
        Confirm {type === "rent" ? "Rental" : "Sale"}
      </Button>
    </Drawer>
  );
}
