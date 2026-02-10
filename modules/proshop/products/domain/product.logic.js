import { z } from "zod";
import { formatMoneyFromCents } from "@shared/lib/money.js";

/**
 * FakeStoreAPI shape:
 * { id, title, price, description, category, image }
 *
 * Your UI/domain expects:
 * { id, name, sku, category, priceCents, costCents, stock, status, productType, isAvailable, updatedAt, variants, imageUrl }
 *
 * We map FakeStore -> domain and store extra fields (sku/stock/status/cost/etc) in localStorage.
 */

/** Status now matches your EPIC doc */
export const PRODUCT_STATUSES = [
  "draft",
  "active",
  "rented",
  "returned",
  "archived",
];
export const PRODUCT_TYPES = ["sale", "rental"];

/** ---------- Zod (Form) ---------- */
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
    imageUrl: z.string().optional().default(""),

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

/** ---------- Defaults ---------- */
export const newProductDefaults = {
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
  imageUrl: "",
  variants: [],
};

/** ---------- Money helpers ---------- */
function toCents(v) {
  // v can be string "12.34" or number
  const n = Number(v || 0);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

function centsToForm(cents) {
  return String((Number(cents || 0) / 100).toFixed(2));
}

export function formatMoney(priceCents, currency = "USD") {
  return formatMoneyFromCents(Number(priceCents || 0), currency);
}

/** ---------- Small domain helpers ---------- */
export function getStockStatusKey(stock) {
  const n = Number(stock ?? 0);
  if (!Number.isFinite(n) || n <= 0) return "out";
  if (n <= 5) return "low";
  return "ok";
}

function safeIsoNow() {
  return new Date().toISOString();
}

function titleToSku(title) {
  const t = String(title || "").trim();
  if (!t) return "";
  return t
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

/** ---------- Local meta store (for fields FakeStoreAPI doesn't have) ---------- */
const META_KEY = "proshop.products.meta.v1";

function canUseStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function loadMetaMap() {
  if (!canUseStorage()) return {};
  try {
    const raw = window.localStorage.getItem(META_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveMetaMap(map) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(META_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function getProductMeta(id) {
  const map = loadMetaMap();
  return map?.[String(id)] || null;
}

export function setProductMeta(id, partial) {
  const key = String(id);
  const map = loadMetaMap();
  const prev = map[key] || {};
  map[key] = { ...prev, ...partial };
  saveMetaMap(map);
  return map[key];
}

export function deleteProductMeta(id) {
  const key = String(id);
  const map = loadMetaMap();
  if (map[key]) {
    delete map[key];
    saveMetaMap(map);
  }
}

/** ---------- Mapping: FakeStore -> Domain ---------- */
export function fromFakeStoreProduct(apiProduct) {
  if (!apiProduct) return null;

  const id = apiProduct.id ?? apiProduct._id ?? apiProduct.productId;
  const key = String(id);

  const meta = getProductMeta(key) || {};

  // Base values from FakeStore
  const name = apiProduct.title ?? apiProduct.name ?? "";
  const category = apiProduct.category ?? "";
  const description = apiProduct.description ?? "";
  const imageUrl = apiProduct.image ?? apiProduct.imageUrl ?? "";

  // FakeStore "price" is float -> cents
  const priceCents = toCents(apiProduct.price);

  // Enriched fields (stored locally)
  const sku =
    meta.sku ?? (id != null ? `FS-${id}` : titleToSku(name) || "FS-NEW");
  const stock = Number.isFinite(Number(meta.stock)) ? Number(meta.stock) : 0;
  const costCents = Number.isFinite(Number(meta.costCents))
    ? Number(meta.costCents)
    : 0;

  const status = PRODUCT_STATUSES.includes(meta.status)
    ? meta.status
    : "active";
  const productType = PRODUCT_TYPES.includes(meta.productType)
    ? meta.productType
    : "sale";
  const isAvailable =
    typeof meta.isAvailable === "boolean" ? meta.isAvailable : true;

  const updatedAt = meta.updatedAt ?? safeIsoNow();

  const variants = Array.isArray(meta.variants) ? meta.variants : [];

  return {
    id,
    name,
    sku,
    category,

    productType,
    status,
    isAvailable,

    priceCents,
    costCents,
    stock,

    description,
    imageUrl,

    variants,

    updatedAt,
  };
}

export function fromFakeStoreList(apiProducts) {
  if (!Array.isArray(apiProducts)) return [];
  return apiProducts.map(fromFakeStoreProduct).filter(Boolean);
}

/** ---------- Mapping: Form <-> Domain ---------- */
export function toFormDefaults(product) {
  if (!product) return { ...newProductDefaults };

  return {
    name: product.title ?? "",
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

/**
 * Domain payload (your richer product model)
 * Use this to set meta store, render UI, etc.
 */
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

/**
 * FakeStore payload (what their API actually accepts)
 * IMPORTANT: FakeStore uses { title, price, description, category, image }
 */
export function toFakeStorePayload(formValues) {
  const domain = toProductPayload(formValues);

  // price is float, not cents
  const price = Number((domain.priceCents / 100).toFixed(2));

  return {
    title: domain.name,
    price,
    description: domain.description ?? "",
    category: domain.category,
    image: domain.imageUrl || "https://i.pravatar.cc/300?img=13",
  };
}

/**
 * After create/update succeeds, persist "extra" fields locally
 * so list/details pages render without missing fields.
 */
export function persistMetaFromForm(id, formValues) {
  const domain = toProductPayload(formValues);

  setProductMeta(id, {
    sku: domain.sku,
    stock: domain.stock,
    costCents: domain.costCents,
    status: domain.status,
    productType: domain.productType,
    isAvailable: domain.isAvailable,
    variants: domain.variants,
    updatedAt: safeIsoNow(),
  });
}
