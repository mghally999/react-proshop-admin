import { z } from "zod";
import { formatMoneyFromCents } from "@shared/lib/money.js";

/* ===============================
   CONSTANTS
================================= */

export const PRODUCT_STATUSES = [
  "draft",
  "active",
  "rented",
  "returned",
  "archived",
];

export const PRODUCT_TYPES = ["sale", "rental"];

/* ===============================
   ZOD SCHEMA
================================= */

const moneyString = z
  .string()
  .default("0")
  .refine((v) => !Number.isNaN(Number(v)), "Must be a number");

const intString = z
  .string()
  .default("0")
  .refine(
    (v) => Number.isInteger(Number(v)) && Number(v) >= 0,
    "Must be a non-negative integer"
  );

export const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  sku: z.string().min(2),
  price: moneyString,
  stock: intString,
  isAvailable: z.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  category: z.string().min(2),

  productType: z.enum(PRODUCT_TYPES),
  status: z.enum(PRODUCT_STATUSES),
  isAvailable: z.boolean(),

  price: moneyString,
  cost: moneyString,
  stock: intString,

  description: z.string().optional(),
  imageUrl: z.string().optional(),

  variants: z.array(variantSchema).default([]),
});

/* ===============================
   HELPERS
================================= */

function toCents(v) {
  return Math.round(Number(v || 0) * 100);
}

function centsToForm(v) {
  return String((Number(v || 0) / 100).toFixed(2));
}

export function formatMoney(priceCents, currency = "USD") {
  return formatMoneyFromCents(Number(priceCents || 0), currency);
}

export function getStockStatusKey(stock) {
  const n = Number(stock ?? 0);

  if (!Number.isFinite(n) || n <= 0) return "Out of stock";
  if (n <= 5) return "Low stock";
  return "In stock";
}


/* ===============================
   FORM DEFAULTS
================================= */

export const newProductDefaults = {
  name: "",
  sku: "",
  category: "",
  productType: "sale",
  status: "draft",
  isAvailable: true,
  price: "0.00",
  cost: "0.00",
  stock: "0",
  description: "",
  imageUrl: "",
  variants: [],
};

/* ===============================
   BACKEND -> FORM
================================= */

export function toFormDefaults(product) {
  if (!product) return { ...newProductDefaults };

  return {
    name: product.name ?? "",
    sku: product.sku ?? "",
    category: product.category ?? "",

    productType: product.productType ?? "sale",
    status: product.status ?? "draft",
    isAvailable: Boolean(product.isAvailable ?? true),

    price: centsToForm(product.priceCents),
    cost: centsToForm(product.costCents),
    stock: String(Number(product.stock ?? 0)),

    description: product.description ?? "",
    imageUrl: product.imageUrl ?? "",

    variants: Array.isArray(product.variants)
      ? product.variants.map((v) => ({
          id: v.id,
          name: v.name ?? "",
          sku: v.sku ?? "",
          price: centsToForm(v.priceCents),
          stock: String(Number(v.stock ?? 0)),
          isAvailable: Boolean(v.isAvailable ?? true),
        }))
      : [],
  };
}

/* ===============================
   FORM -> BACKEND PAYLOAD
================================= */

export function toProductPayload(formValues) {
  const parsed = productSchema.parse(formValues);

  return {
    name: parsed.name,
    sku: parsed.sku,
    category: parsed.category,

    productType: parsed.productType,
    status: parsed.status,
    isAvailable: parsed.isAvailable,

    priceCents: toCents(parsed.price),
    costCents: toCents(parsed.cost),
    stock: Number(parsed.stock),

    description: parsed.description ?? "",
    imageUrl: parsed.imageUrl ?? "",

    variants: parsed.variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      priceCents: toCents(v.price),
      stock: Number(v.stock),
      isAvailable: v.isAvailable,
    })),
  };
}
