import { db, persist } from "../db/store.js";
import { uid } from "@shared/lib/id.js";
import { nowISO } from "@shared/lib/dates.js";
import { addAudit, addNotification } from "../utils/events.js";

const VAT = 0.05;

function findProduct(productId) {
  return db().products.find((p) => String(p.id) === String(productId)) || null;
}

function findVariant(product, variantId) {
  if (!product || !variantId) return null;
  return (product.variants || []).find((v) => String(v.id) === String(variantId)) || null;
}

function ensureStock(product, variant, qty) {
  const available = variant ? Number(variant.stock || 0) : Number(product.stock || 0);
  if (available < qty) throw new Error("Insufficient stock");
}

function decStock(product, variant, qty) {
  if (variant) variant.stock = Math.max(0, Number(variant.stock || 0) - qty);
  else product.stock = Math.max(0, Number(product.stock || 0) - qty);
}

function incStock(product, variant, qty) {
  if (variant) variant.stock = Number(variant.stock || 0) + qty;
  else product.stock = Number(product.stock || 0) + qty;
}

function makeInvoiceFor(tx) {
  const inv = {
    id: uid("inv"),
    transactionId: tx.id,
    createdAt: nowISO(),
    status: "unpaid",
    type: tx.type,
    userId: tx.userId,
    productName: tx.productName,
    totalCents: tx.totalCents,
  };
  db().invoices.unshift(inv);
  return inv;
}

export const transactionsMock = {
  list(params = {}) {
    const { type, status } = params;
    let items = [...db().transactions];

    if (type) items = items.filter((t) => t.type === type);
    if (status) items = items.filter((t) => t.status === status);

    return { items, total: items.length };
  },

  create(payload) {
    const product = findProduct(payload.productId);
    if (!product) throw new Error("Product not found");

    const variant = findVariant(product, payload.variantId);
    const type = payload.type; // "sale" | "rent"
    const user = db().users.find((u) => String(u.id) === String(payload.userId));
    if (!user) throw new Error("User not found");

    // stock rules (US-06 / FR-11–14)
    if (type === "sale") ensureStock(product, variant, Math.max(1, payload.qty || 1));
    if (type === "rent") ensureStock(product, variant, 1);

    // pricing (US-11 / FR-08)
    const qty = type === "sale" ? Math.max(1, Number(payload.qty || 1)) : 1;
    const duration = type === "rent" ? Math.max(1, Number(payload.duration || 1)) : null;

    const baseUnit = variant ? variant.priceCents : product.priceCents;
    const subtotalCents =
      payload.overrideTotalCents != null
        ? Number(payload.overrideTotalCents)
        : type === "sale"
        ? baseUnit * qty
        : (() => {
            const r = product.rental;
            if (!r) return 0;
            const flat = Number(r.flatRateCents || 0);
            const rate = Number(r.rateCents || 0);
            const deposit = Number(r.depositCents || 0);
            return (flat > 0 ? flat : rate * duration) + deposit;
          })();

    const taxCents = Math.round(subtotalCents * VAT);
    const totalCents = subtotalCents + taxCents;

    // apply stock change
    if (type === "sale") decStock(product, variant, qty);
    if (type === "rent") decStock(product, variant, 1);

    const tx = {
      id: uid("tx"),
      type,
      status: type === "sale" ? "sold" : "rented",
      createdAt: nowISO(),
      returnedAt: null,

      productId: product.id,
      variantId: variant?.id || null,
      productName: product.name,
      userId: user.id,
      userName: user.name,

      qty,
      duration,

      unitPriceCents: baseUnit,
      subtotalCents,
      taxCents,
      totalCents,
      overrideTotalCents: payload.overrideTotalCents ?? null,
    };

    db().transactions.unshift(tx);

    // invoice (US-12 / FR-10)
    const inv = makeInvoiceFor(tx);

    // audit (US-10 / FR-23)
    addAudit({
      action: type === "sale" ? "sale_created" : "rental_created",
      entity: "transaction",
      entityId: tx.id,
      userId: user.id,
      meta: { productId: product.id, variantId: variant?.id || null, invoiceId: inv.id, overrideTotalCents: tx.overrideTotalCents },
    });

    // notifications (US-07 / FR-18)
    addNotification({
      to: "admin",
      kind: "success",
      title: type === "sale" ? "Product sold" : "Product rented",
      message: `${product.name} → ${user.name} (${type})`,
    });

    addNotification({
      to: "user",
      userId: user.id,
      kind: "info",
      title: "Invoice created",
      message: `Invoice generated for ${product.name}.`,
    });

    persist({ entity: "transactions", action: "create", id: tx.id });
    return tx;
  },

  markReturned(id) {
    const tx = db().transactions.find((x) => String(x.id) === String(id));
    if (!tx) throw new Error("Transaction not found");
    if (tx.type !== "rent") throw new Error("Only rentals can be returned");
    if (tx.status !== "rented") return tx;

    const product = findProduct(tx.productId);
    const variant = findVariant(product, tx.variantId);

    // stock restore (US-14)
    incStock(product, variant, 1);

    tx.status = "returned";
    tx.returnedAt = nowISO();

    addAudit({
      action: "rental_returned",
      entity: "transaction",
      entityId: tx.id,
      userId: tx.userId,
      meta: { productId: tx.productId, variantId: tx.variantId },
    });

    addNotification({
      to: "admin",
      kind: "info",
      title: "Rental returned",
      message: `${tx.productName} returned by ${tx.userName}`,
    });

    persist({ entity: "transactions", action: "return", id: tx.id });
    return tx;
  },
};

export default transactionsMock;
