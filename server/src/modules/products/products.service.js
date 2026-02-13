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

export async function list({ q, status, sort, page = 1, limit = 10 }) {
  const filter = { isDeleted: false };

  if (status && status !== "all") {
    filter.status = status;
  }

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { sku: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ];
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(50, Number(limit) || 10);
  const skip = (pageNum - 1) * limitNum;

  const [rows, total] = await Promise.all([
    Product.find(filter)
      .sort(toSort(sort))
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    items: rows,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
}

export async function getById(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(400, "Invalid product id");
  }

  const doc = await Product.findOne({
    _id: id,
    isDeleted: false,
  }).lean();

  if (!doc) throw httpError(404, "Product not found");

  return doc;
}

export async function create(payload) {
  if (!payload?.name || !payload?.sku || !payload?.category) {
    throw httpError(400, "name, sku, category required");
  }

  const exists = await Product.findOne({ sku: payload.sku });
  if (exists) throw httpError(409, "SKU already exists");

  // sanitize status safely
  const allowedStatuses = ["draft", "active", "rented", "returned", "archived"];

  let status = "draft";

  if (payload.status) {
    const cleaned = String(payload.status).trim().toLowerCase();
    if (allowedStatuses.includes(cleaned)) {
      status = cleaned;
    }
  }

  const doc = await Product.create({
    ...payload,
    status,
  });

  return doc.toJSON();
}


export async function update(id, patch) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(400, "Invalid product id");
  }

  const doc = await Product.findByIdAndUpdate(
    id,
    { $set: patch },
    { new: true }
  );

  if (!doc) throw httpError(404, "Product not found");

  return doc.toJSON();
}

export async function remove(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw httpError(400, "Invalid product id");
  }

  const result = await Product.deleteOne({ _id: id });

  if (!result.deletedCount) {
    throw httpError(404, "Product not found");
  }

  return { ok: true };
}

/* ===============================
   FAKESTORE IMPORT (STABLE)
   =============================== */

function moneyToCents(n) {
  return Math.round(Number(n || 0) * 100);
}

function mapFakeStore(fs) {
  const priceCents = moneyToCents(fs.price);
  const stock = Number(fs?.rating?.count ?? 10);

  return {
    name: fs.title,
    sku: `FS-${fs.id}`,
    category: fs.category,
    productType: "sale",
    status: "active",
    priceCents,
    costCents: Math.round(priceCents * 0.6),
    stock,
    description: fs.description,
    imageUrl: fs.image,
    external: {
      provider: "fakestore",
      externalId: fs.id,
    },
  };
}

export async function importFakeStore() {
  const response = await fetch("https://fakestoreapi.com/products");
  if (!response.ok) throw httpError(502, "Failed to fetch FakeStore");

  const data = await response.json();

  const ops = data.map((fs) => {
    const mapped = mapFakeStore(fs);

    return {
      updateOne: {
        filter: { sku: mapped.sku },
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
