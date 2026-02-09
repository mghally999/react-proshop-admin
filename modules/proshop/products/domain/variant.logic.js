// src/modules/proshop/products/domain/variant.logic.js
import { z } from "zod";

export const VARIANT_FORM_SCHEMA = z.object({
  id: z.string().min(1, "Variant id is required"),
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(2, "Variant SKU is required"),
  price: z
    .string()
    .default("0")
    .refine((v) => !Number.isNaN(Number(v)), "Variant price must be a number"),
  stock: z
    .string()
    .default("0")
    .refine(
      (v) => Number.isInteger(Number(v)) && Number(v) >= 0,
      "Variant stock must be a non-negative integer"
    ),
  isAvailable: z.boolean().default(true),
});

export function makeVariantId() {
  // Works in modern browsers; fallback for older ones.
  try {
    return crypto.randomUUID();
  } catch {
    return `var_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

export function normalizeSku(s) {
  return String(s ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "-");
}

export function toVariantDefaults(variant) {
  if (!variant) {
    return {
      id: makeVariantId(),
      name: "",
      sku: "",
      price: "0",
      stock: "0",
      isAvailable: true,
    };
  }

  const priceCents =
    typeof variant.priceCents === "number"
      ? variant.priceCents
      : Math.round(Number(variant.price ?? 0) * 100);

  const stock =
    typeof variant.stock === "number"
      ? variant.stock
      : Number(variant.stockQty ?? 0);

  return {
    id: String(variant.id ?? makeVariantId()),
    name: String(variant.name ?? ""),
    sku: String(variant.sku ?? ""),
    price: String((Number(priceCents ?? 0) / 100).toFixed(2)),
    stock: String(Number(stock ?? 0)),
    isAvailable: Boolean(
      variant.isAvailable ?? variant.available ?? variant.availability ?? true
    ),
  };
}

export function toVariantPayload(formVariant) {
  const parsed = VARIANT_FORM_SCHEMA.parse({
    ...formVariant,
    sku: normalizeSku(formVariant?.sku),
  });

  return {
    id: parsed.id,
    name: parsed.name,
    sku: parsed.sku,
    priceCents: Math.round(Number(parsed.price) * 100),
    stock: Number(parsed.stock),
    isAvailable: parsed.isAvailable,
  };
}
