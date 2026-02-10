import axios from "axios";
import Product from "../models/Product.js";

function moneyToCents(v) {
  if (v === null || v === undefined) return 0;
  const n = typeof v === "number" ? v : Number(String(v).replace(",", "."));
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 100);
}

function safeInt(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function parseSort(sortRaw) {
  // "updatedAt:desc"
  const [fieldRaw, dirRaw] = String(sortRaw || "updatedAt:desc").split(":");
  const dir = dirRaw === "asc" ? 1 : -1;

  // map allowed fields
  const map = {
    name: "name",
    price: "priceCents",
    priceCents: "priceCents",
    stock: "stock",
    status: "status",
    updatedAt: "updatedAt",
    createdAt: "createdAt",
  };

  const field = map[fieldRaw] ?? "updatedAt";
  return { [field]: dir };
}

function toDto(doc) {
  const o = doc.toObject ? doc.toObject() : doc;

  return {
    id: String(o._id ?? o.id),

    name: o.name ?? "",
    sku: o.sku ?? "",
    category: o.category ?? "",
    productType: o.productType ?? "sale",
    status: o.status ?? "draft",
    isAvailable: Boolean(o.isAvailable),

    description: o.description ?? "",
    priceCents: safeInt(o.priceCents, 0),
    costCents: safeInt(o.costCents, 0),
    stock: safeInt(o.stock, 0),

    imageUrl: o.imageUrl ?? "",
    variants: Array.isArray(o.variants) ? o.variants : [],

    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

export async function listProducts(req, res) {
  try {
    const page = Math.max(1, safeInt(req.query.page, 1));
    const pageSize = Math.max(
      1,
      safeInt(req.query.pageSize ?? req.query.limit, 10)
    );

    const search = String(req.query.search ?? req.query.q ?? "").trim();
    const status = String(req.query.status ?? "all");
    const sort = parseSort(req.query.sort);

    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: rx }, { sku: rx }, { category: rx }];
    }

    const total = await Product.countDocuments(filter);
    const pages = Math.max(1, Math.ceil(total / pageSize));

    const items = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return res.json({
      items: items.map(toDto),
      meta: { page, pageSize, total, pages },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message ?? "Server error" });
  }
}

export async function getProduct(req, res) {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    return res.json(toDto(p));
  } catch (err) {
    return res.status(500).json({ message: err.message ?? "Server error" });
  }
}

export async function createProduct(req, res) {
  try {
    const body = req.body ?? {};

    // Accept either price/ cost (money) or priceCents/costCents
    const priceCents = body.priceCents ?? moneyToCents(body.price);
    const costCents = body.costCents ?? moneyToCents(body.cost);

    const doc = await Product.create({
      name: body.name,
      sku: body.sku,
      category: body.category ?? "",
      productType: body.productType ?? "sale",
      status: body.status ?? "draft",
      isAvailable: body.isAvailable ?? true,
      description: body.description ?? "",

      priceCents,
      costCents,
      stock: safeInt(body.stock, 0),

      imageUrl: body.imageUrl ?? "",
      variants: Array.isArray(body.variants) ? body.variants : [],
    });

    // IMPORTANT: return {id: ...} so frontend never navigates to /undefined
    return res.status(201).json(toDto(doc));
  } catch (err) {
    return res.status(400).json({ message: err.message ?? "Bad request" });
  }
}

export async function updateProduct(req, res) {
  try {
    const body = req.body ?? {};
    const priceCents = body.priceCents ?? moneyToCents(body.price);
    const costCents = body.costCents ?? moneyToCents(body.cost);

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: body.name,
        sku: body.sku,
        category: body.category ?? "",
        productType: body.productType ?? "sale",
        status: body.status ?? "draft",
        isAvailable: body.isAvailable ?? true,
        description: body.description ?? "",

        priceCents,
        costCents,
        stock: safeInt(body.stock, 0),

        imageUrl: body.imageUrl ?? "",
        variants: Array.isArray(body.variants) ? body.variants : [],
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Product not found" });
    return res.json(toDto(updated));
  } catch (err) {
    return res.status(400).json({ message: err.message ?? "Bad request" });
  }
}

export async function deleteProduct(req, res) {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ message: err.message ?? "Server error" });
  }
}

export async function importFakeStore(req, res) {
  try {
    const { data } = await axios.get("https://fakestoreapi.com/products");
    if (!Array.isArray(data)) {
      return res
        .status(500)
        .json({ message: "FakeStore returned invalid data" });
    }

    const ops = data.map((p) => {
      const externalId = String(p.id);
      const sku = `FS-${externalId}`;

      return {
        updateOne: {
          filter: { sku },
          update: {
            $set: {
              name: p.title ?? `FakeStore ${externalId}`,
              sku,
              category: p.category ?? "",
              description: p.description ?? "",
              imageUrl: p.image ?? "",

              // convert FakeStore price to cents
              priceCents: moneyToCents(p.price ?? 0),
              costCents: 0,

              stock: safeInt(p?.rating?.count, 0),
              status: "active",
              isAvailable: true,
              productType: "sale",
            },
          },
          upsert: true,
        },
      };
    });

    const result = await Product.bulkWrite(ops, { ordered: false });

    return res.json({
      imported: data.length,
      upserted: result.upsertedCount ?? 0,
      modified: result.modifiedCount ?? 0,
      matched: result.matchedCount ?? 0,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message ?? "Server error" });
  }
}
