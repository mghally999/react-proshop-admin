import mongoose from "mongoose";
import { Product } from "./products.model.js";

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function toSort(sortStr = "updatedAt:desc") {
  const [field, dir] = String(sortStr).split(":");
  const direction = dir === "asc" ? 1 : -1;

  const allowed = new Set([
    "updatedAt",
    "createdAt",
    "name",
    "stock",
    "priceCents",
    "status",
  ]);
  const safeField = allowed.has(field) ? field : "updatedAt";

  return { [safeField]: direction };
}

function toDto(doc) {
  // doc might already be JSON-transformed if not lean()
  const id = doc.id ?? doc._id;
  return { ...doc, id: String(id) };
}

export async function list({ q, status, sort, page = 1, limit = 10 }) {
  const filter = { isDeleted: false };

  if (status && status !== "all") filter.status = status;

  if (q && String(q).trim()) {
    // text search if index is there, fallback regex if not
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { sku: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [rows, total] = await Promise.all([
    Product.find(filter).sort(toSort(sort)).skip(skip).limit(limitNum).lean(),
    Product.countDocuments(filter),
  ]);

  const pages = Math.max(1, Math.ceil(total / limitNum));

  return {
    items: rows.map((r) => toDto(r)),
    meta: { page: pageNum, limit: limitNum, total, pages },
  };
}

export async function getById(id) {
  if (!mongoose.isValidObjectId(id)) throw httpError(400, "Invalid product id");

  const doc = await Product.findOne({ _id: id, isDeleted: false }).lean();
  if (!doc) throw httpError(404, "Product not found");

  return toDto(doc);
}

export async function create(payload, userId = null) {
  if (!payload?.name || !payload?.sku || !payload?.category) {
    throw httpError(400, "name, sku, category are required");
  }

  const exists = await Product.findOne({ sku: payload.sku }).lean();
  if (exists) throw httpError(409, "SKU already exists");

  const doc = await Product.create({
    ...payload,
    createdBy: userId,
  });

  return doc.toJSON(); // includes id due to schema transform
}

export async function update(id, patch) {
  if (!mongoose.isValidObjectId(id)) throw httpError(400, "Invalid product id");

  const doc = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: patch },
    { new: true }
  );

  if (!doc) throw httpError(404, "Product not found");
  return doc.toJSON();
}

export async function remove(id) {
  if (!mongoose.isValidObjectId(id)) throw httpError(400, "Invalid product id");

  const doc = await Product.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $set: { isDeleted: true, deletedAt: new Date() } },
    { new: true }
  );

  if (!doc) throw httpError(404, "Product not found");
  return { ok: true };
}

function moneyToCents(n) {
  return Math.round(Number(n || 0) * 100);
}

function mapFakeStoreToProduct(fs) {
  const priceCents = moneyToCents(fs.price);
  const stock = Number(fs?.rating?.count ?? 0);

  return {
    name: fs.title,
    sku: `FS-${fs.id}`,
    category: fs.category || "general",

    productType: "sale",
    status: "active",
    isAvailable: true,

    priceCents,
    costCents: Math.round(priceCents * 0.6),
    stock,

    description: fs.description || "",
    variants: [],

    external: {
      provider: "fakestore",
      externalId: Number(fs.id),
    },
  };
}

export async function importFakeStore() {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw httpError(502, "Failed to fetch FakeStore");

  const data = await res.json();
  if (!Array.isArray(data))
    throw httpError(502, "FakeStore returned invalid data");

  const ops = data.map((fs) => {
    const mapped = mapFakeStoreToProduct(fs);

    return {
      updateOne: {
        filter: {
          "external.provider": "fakestore",
          "external.externalId": mapped.external.externalId,
        },
        update: { $set: mapped },
        upsert: true,
      },
    };
  });

  const result = await Product.bulkWrite(ops, { ordered: false });

  return {
    imported: data.length,
    upserted: result.upsertedCount ?? 0,
    modified: result.modifiedCount ?? 0,
  };
}
