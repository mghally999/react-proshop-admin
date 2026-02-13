import mongoose from "mongoose";
import { Transaction } from "./transactions.model.js";
import { Product } from "../products/products.model.js";
import { Invoice }  from "../invoices/invoices.model.js";
import { User } from "../users/users.model.js";
import { addAudit } from "../audit/audit.service.js";
import { createNotification } from "../notifications/notifications.service.js";
import { sendEmail } from "../../integrations/mailer.js";
import { emitEvent } from "../../realtime/realtime.js";

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function toDto(doc) {
  const id = doc.id ?? doc._id;
  const line0 = doc?.lines?.[0] || {};
  const u = doc?.userId || null;
  const userName = u
    ? [u?.name?.firstname, u?.name?.lastname].filter(Boolean).join(" ") || u.username || u.email
    : "";
  return {
    ...doc,
    id: String(id),
    productName: line0.name || "",
    sku: line0.sku || "",
    qty: Number(line0.quantity || 0),
    userName,
    duration: doc?.rental?.duration ?? null,
  };
}

function nextInvoiceNumber() {
  // interview-friendly: timestamp-based invoice number (unique enough for demo)
  return `INV-${Date.now()}`;
}

function computeTotals(lines, taxRate = 0) {
  const subtotalCents = lines.reduce((acc, l) => acc + Number(l.totalCents || 0), 0);
  const taxCents = Math.round(subtotalCents * taxRate);
  const totalCents = subtotalCents + taxCents;
  return { subtotalCents, taxCents, totalCents };
}

function getVariant(product, variantId) {
  if (!variantId) return null;
  return (product.variants || []).find((v) => String(v.id) === String(variantId) || String(v.sku) === String(variantId));
}

async function applyStockChange({ product, variant, delta }) {
  // delta: negative means reduce stock
  if (variant) {
    const next = Number(variant.stock || 0) + delta;
    if (next < 0) throw httpError(409, "Insufficient variant stock");
    variant.stock = next;
    await product.save();
    return;
  }

  const next = Number(product.stock || 0) + delta;
  if (next < 0) throw httpError(409, "Insufficient product stock");
  product.stock = next;

  // simple status rule for demo
  if (product.status !== "hidden") {
    if (next <= 0) product.status = "out_of_stock";
    else if (next <= 5) product.status = "low_stock";
    else product.status = "active";
  }
  await product.save();
}

export async function list({ type, status, page = 1, limit = 20 } = {}) {
  const filter = {};
  if (type && type !== "all") filter.type = type;
  if (status && status !== "all") filter.status = status;

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(50, Math.max(1, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [rows, total] = await Promise.all([
    Transaction.find(filter)
      .populate("userId", "username email name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Transaction.countDocuments(filter),
  ]);

  const pages = Math.max(1, Math.ceil(total / limitNum));
  return { items: rows.map((r) => toDto(r)), meta: { page: pageNum, limit: limitNum, total, pages } };
}

export async function getById(id) {
  if (!mongoose.isValidObjectId(id)) throw httpError(400, "Invalid transaction id");
  const doc = await Transaction.findById(id).lean();
  if (!doc) throw httpError(404, "Transaction not found");
  return toDto(doc);
}

export async function create(payload, adminUserId = null) {
  const {
    type,
    userId,
    productId,
    variantId,
    // FE sends `quantity` (sale) or 1 (rental)
    quantity = 1,
    // priceOverrideCents = override unit price; overrideTotalCents = override final total
    priceOverrideCents,
    overrideTotalCents,
    rental,
    notes = "",
  } = payload || {};

  if (!type || !["sale", "rental"].includes(type)) throw httpError(400, "type must be sale or rental");
  if (!mongoose.isValidObjectId(userId)) throw httpError(400, "Invalid userId");
  if (!mongoose.isValidObjectId(productId)) throw httpError(400, "Invalid productId");

  const qty = Math.max(1, Number(quantity) || 1);

  const product = await Product.findById(productId);
  if (!product) throw httpError(404, "Product not found");

  const variant = getVariant(product, variantId);

  const computedUnitPriceCents = Number(variant?.priceCents ?? product.priceCents ?? 0);
  const baseUnitPriceCents = Number(priceOverrideCents ?? computedUnitPriceCents);

  let unitPriceCents = baseUnitPriceCents;
  let rentalMeta = null;
  let status = "sold";

  if (type === "rental") {
    const unit = rental?.unit || product.rental?.unit || "day";
    const duration = Math.max(1, Number(rental?.duration || 1));
    const rateCents = Number(rental?.rateCents ?? variant?.rental?.rateCents ?? product.rental?.rateCents ?? unitPriceCents);
    const flatRateCents = Number(rental?.flatRateCents ?? product.rental?.flatRateCents ?? 0);
    const depositCents = Number(rental?.depositCents ?? product.rental?.depositCents ?? 0);

    const rentalCost = flatRateCents > 0 ? flatRateCents : rateCents * duration;
    unitPriceCents = rentalCost; // store as line unit price (single line total)

    rentalMeta = {
      unit,
      duration,
      depositCents,
      startAt: rental?.startAt ? new Date(rental.startAt) : new Date(),
      endAt: rental?.endAt ? new Date(rental.endAt) : null,
    };

    status = "rented";
  }

  let lineTotalCents = unitPriceCents * qty;

  // FE override: treat overrideTotalCents as the final subtotal for the line
  if (overrideTotalCents !== undefined && overrideTotalCents !== null && overrideTotalCents !== "") {
    const forcedTotal = Math.max(0, Number(overrideTotalCents) || 0);
    lineTotalCents = forcedTotal;
    if (qty > 0) unitPriceCents = Math.round(forcedTotal / qty);
  }
  const lines = [
    {
      productId: product._id,
      variantId: variantId ? String(variantId) : null,
      name: product.name,
      sku: variant?.sku || product.sku,
      quantity: qty,
      unitPriceCents,
      totalCents: lineTotalCents,
    },
  ];

  const totals = computeTotals(lines, 0);

  // stock change: sale & rental both reserve inventory
  await applyStockChange({ product, variant, delta: -qty });

  const tx = await Transaction.create({
    type,
    status,
    userId,
    lines,
    rental: rentalMeta,
    ...totals,
    notes,
    createdBy: adminUserId,
  });

  const inv = await Invoice.create({
    invoiceNumber: nextInvoiceNumber(),
    transactionId: tx._id,
    userId,
    type,
    status: "issued",
    lines: lines.map((l) => ({
      name: l.name,
      sku: l.sku,
      quantity: l.quantity,
      unitPriceCents: l.unitPriceCents,
      totalCents: l.totalCents,
    })),
    ...totals,
    meta: { rental: rentalMeta },
  });

  const user = await User.findById(userId).lean();

  await addAudit({
    action: type === "sale" ? "transaction.sale" : "transaction.rental",
    adminId: String(adminUserId ?? "unknown"),
    entityType: "transaction",
    entityId: String(tx._id),
    details: { productId, variantId: variantId || null, qty, totalCents: totals.totalCents },
  });

  await createNotification({
    type: type === "sale" ? "sale.created" : "rental.created",
    severity: "info",
    title: type === "sale" ? "Product sold" : "Product rented",
    message: `${product.name} (${variant?.sku || product.sku || "—"}) ${type === "sale" ? "sold" : "rented"} to ${user?.username || user?.email || "user"}.`,
    entityType: "transaction",
    entityId: String(tx._id),
    meta: { userId: String(userId), invoiceId: String(inv._id) },
  });

  // Email (optional). If SMTP not configured, it will log to console.
  if (user?.email) {
    await sendEmail({
      to: user.email,
      subject: type === "sale" ? `Your purchase invoice ${inv.invoiceNumber}` : `Your rental invoice ${inv.invoiceNumber}`,
      text: `Hello ${user.username || ""}\n\nInvoice: ${inv.invoiceNumber}\nTotal: ${(totals.totalCents / 100).toFixed(2)}\n\nThank you.`,
    });
  }

  emitEvent("transactions:changed", { id: String(tx._id), type, status });
  emitEvent("invoices:changed", { id: String(inv._id), type: inv.type });
  emitEvent("dashboard:changed", {});
  emitEvent("reports:changed", {});
  emitEvent("audit:changed", {});

  // Low stock check
  const pAfter = await Product.findById(product._id).lean();
  if (Number(pAfter?.stock ?? 0) <= 5) {
    await createNotification({
      type: "stock.low",
      severity: "warning",
      title: "Low stock",
      message: `${pAfter.name} is low on stock: ${pAfter.stock}`,
      entityType: "product",
      entityId: String(pAfter._id),
      meta: { stock: pAfter.stock },
    });
  }

  return { transaction: tx.toJSON(), invoice: inv.toJSON() };
}

export async function markReturned(id, adminUserId = null) {
  if (!mongoose.isValidObjectId(id)) throw httpError(400, "Invalid transaction id");

  const tx = await Transaction.findById(id);
  if (!tx) throw httpError(404, "Transaction not found");
  if (tx.type !== "rental") throw httpError(400, "Only rentals can be returned");
  if (tx.status === "returned") return { ok: true, transaction: tx.toJSON() };

  // restock
  const line = tx.lines?.[0];
  const product = await Product.findById(line.productId);
  if (!product) throw httpError(404, "Product not found");
  const variant = getVariant(product, line.variantId);
  await applyStockChange({ product, variant, delta: Number(line.quantity || 1) });

  tx.status = "returned";
  tx.rental = { ...(tx.rental || {}), endAt: new Date() };
  tx.createdBy = tx.createdBy || adminUserId;
  await tx.save();

  // issue return invoice (0 total, for trace)
  await Invoice.create({
    invoiceNumber: nextInvoiceNumber(),
    transactionId: tx._id,
    userId: tx.userId,
    type: "return",
    status: "issued",
    lines: tx.lines.map((l) => ({
      name: l.name,
      sku: l.sku,
      quantity: l.quantity,
      unitPriceCents: 0,
      totalCents: 0,
    })),
    subtotalCents: 0,
    taxCents: 0,
    totalCents: 0,
    meta: { rental: tx.rental },
  });

  const user = await User.findById(tx.userId).lean();
  await addAudit({
    action: "rental.returned",
    adminId: String(adminUserId ?? "unknown"),
    entityType: "transaction",
    entityId: String(tx._id),
    details: { userId: String(tx.userId), productId: String(line.productId) },
  });

  await createNotification({
    type: "rental.returned",
    severity: "success",
    title: "Rental returned",
    message: `${line.name} has been returned by ${user?.username || user?.email || "user"}.`,
    entityType: "transaction",
    entityId: String(tx._id),
    meta: { userId: String(tx.userId) },
  });

  if (user?.email) {
    await sendEmail({
      to: user.email,
      subject: `Rental return confirmed`,
      text: `Hello ${user.username || ""}\n\nWe confirmed your return for: ${line.name}.\n\nThank you.`,
    });
  }

  emitEvent("transactions:changed", { id: String(tx._id), status: "returned" });
  emitEvent("dashboard:changed", {});
  emitEvent("reports:changed", {});
  emitEvent("audit:changed", {});

  return { ok: true, transaction: tx.toJSON() };
}
