import { z } from "zod";
import { formatMoneyFromCents } from "@shared/lib/money.js";

/** Status now matches the EPIC doc */
export const PRODUCT_STATUSES = ["draft", "active", "rented", "returned", "archived"];
export const PRODUCT_TYPES = ["sale", "rental"];

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
  name: z.string().min(1, "Variant name is required"),
  sku: z.string().min(2, "Variant SKU is required"),
  price: moneyString,
  stock: intString,
  isAvailable: z.boolean().default(true),
});

export const productSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    sku: z.string().min(2, "SKU is required"),
    category: z.string().min(2, "Category is required"),

    productType: z.enum(PRODUCT_TYPES).default("sale"),
    status: z.enum(PRODUCT_STATUSES).default("draft"),
    isAvailable: z.boolean().default(true),

    price: moneyString,
    cost: moneyString,
    stock: intString,

    description: z.string().optional().default(""),

    variants: z.array(variantSchema).default([]),
  })
  .superRefine((val, ctx) => {
    // enforce unique variant SKUs (US-02)
    const seen = new Set();

    for (let i = 0; i < val.variants.length; i++) {
      const sku = String(val.variants[i].sku || "")
        .trim()
        .toLowerCase();

      if (!sku) continue;

      if (seen.has(sku)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants"],
          message: "Variant SKUs must be unique.",
        });
        break;
      }

      seen.add(sku);
    }
  });

function toCents(v) {
  return Math.round(Number(v || 0) * 100);
}

function centsToForm(cents) {
  return String((Number(cents || 0) / 100).toFixed(2));
}

export function toFormDefaults(product) {
  if (!product) {
    return {
      name: "",
      sku: "",
      category: "",
      productType: "sale",
      status: "draft",
      isAvailable: true,
      price: "0",
      cost: "0",
      stock: "0",
      description: "",
      variants: [],
    };
  }

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

export function formatMoney(priceCents, currency = "AED") {
  return formatMoneyFromCents(Number(priceCents || 0), currency);
}

export function getStockStatusKey(stock) {
  const n = Number(stock ?? 0);
  if (!Number.isFinite(n) || n <= 0) return "out";
  if (n <= 5) return "low";
  return "ok";
}
