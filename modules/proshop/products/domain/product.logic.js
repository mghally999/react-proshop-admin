// src/modules/proshop/products/domain/product.logic.js
import { z } from "zod";
import { formatMoneyFromCents } from "/shared/lib/money.js";

export const PRODUCT_STATUSES = ["draft", "active", "archived"];

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  sku: z.string().min(2, "SKU is required"),
  category: z.string().min(2, "Category is required"),
  price: z
    .string()
    .default("0")
    .refine((v) => !Number.isNaN(Number(v)), "Price must be a number"),
  stock: z
    .string()
    .default("0")
    .refine(
      (v) => Number.isInteger(Number(v)) && Number(v) >= 0,
      "Stock must be a non-negative integer"
    ),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
});

export function toFormDefaults(product) {
  if (!product) {
    return {
      name: "",
      sku: "",
      category: "",
      price: "0",
      stock: "0",
      status: "draft",
    };
  }

  return {
    name: product.name ?? "",
    sku: product.sku ?? "",
    category: product.category ?? "",
    price: String((Number(product.priceCents ?? 0) / 100).toFixed(2)),
    stock: String(Number(product.stock ?? 0)),
    status: product.status ?? "draft",
  };
}

export function toProductPayload(formValues) {
  const parsed = productSchema.parse(formValues);

  const priceCents = Math.round(Number(parsed.price) * 100);
  const stock = Number(parsed.stock);

  return {
    name: parsed.name,
    sku: parsed.sku,
    category: parsed.category,
    priceCents,
    stock,
    status: parsed.status,
  };
}

export function formatMoney(priceCents, currency = "AED") {
  return formatMoneyFromCents(priceCents, currency);
}

export function getStockStatusKey(stock) {
  const n = Number(stock ?? 0);
  if (n <= 0) return "out";
  if (n <= 5) return "low";
  return "ok";
}
