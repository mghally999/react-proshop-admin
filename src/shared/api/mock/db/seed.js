import { nowISO } from "@shared/lib/dates.js";

export function seedAll() {
  const t = nowISO();

  // USERS (for Sell/Rent page)
  const users = [
    { id: "u1", name: "Omar Ali", email: "omar@demo.com" },
    { id: "u2", name: "Sara Khan", email: "sara@demo.com" },
    { id: "u3", name: "John Smith", email: "john@demo.com" },
  ];

  // PRODUCTS (US-01 / US-02 / US-03 / FR-01 / FR-04 / FR-06)
  const products = [
    {
      id: "p1",
      name: "Premium Golf Gloves",
      sku: "GLOVE",
      category: "Accessories",
      productType: "sale",
      status: "active",
      isAvailable: true,
      priceCents: 7500,
      costCents: 3500,
      stock: 0, // using variants stock instead
      description: "Tour-grade gloves with breathable grip.",
      variants: [
        { id: "v1", name: "Size S", sku: "GLOVE-S", priceCents: 7500, stock: 12, isAvailable: true },
        { id: "v2", name: "Size M", sku: "GLOVE-M", priceCents: 7500, stock: 3, isAvailable: true },  // LOW STOCK demo
        { id: "v3", name: "Size L", sku: "GLOVE-L", priceCents: 7500, stock: 0, isAvailable: false }, // OUT OF STOCK demo
      ],
      rental: null,
      updatedAt: t,
    },
    {
      id: "p2",
      name: "Golf Cart",
      sku: "CART",
      category: "Rental",
      productType: "rental",
      status: "active",
      isAvailable: true,
      priceCents: 0,
      costCents: 0,
      stock: 3,
      description: "Electric cart. Rental includes deposit.",
      variants: [],
      rental: {
        unit: "day",
        rateCents: 25000,
        flatRateCents: 0,
        depositCents: 50000,
      },
      updatedAt: t,
    },
    {
      id: "p3",
      name: "Pro V1 Balls Pack (12)",
      sku: "BALLS-12",
      category: "Consumables",
      productType: "sale",
      status: "active",
      isAvailable: true,
      priceCents: 4500,
      costCents: 2000,
      stock: 4, // LOW STOCK demo
      description: "Premium balls pack, 12 pcs.",
      variants: [],
      rental: null,
      updatedAt: t,
    },
    {
      id: "p4",
      name: "Umbrella (Club Branded)",
      sku: "UMBR-01",
      category: "Accessories",
      productType: "sale",
      status: "active",
      isAvailable: false,
      priceCents: 6500,
      costCents: 2500,
      stock: 0, // OUT OF STOCK demo
      description: "Out of stock example.",
      variants: [],
      rental: null,
      updatedAt: t,
    },
  ];

  // TRANSACTIONS + INVOICES (US-04 / US-05 / US-11 / US-12 / US-13)
  const transactions = [
    {
      id: "tx1",
      type: "sale",
      status: "sold",
      createdAt: t,
      productId: "p3",
      variantId: null,
      productName: "Pro V1 Balls Pack (12)",
      userId: "u1",
      userName: "Omar Ali",
      qty: 2,
      unitPriceCents: 4500,
      subtotalCents: 9000,
      taxCents: 450,
      totalCents: 9450,
      overrideTotalCents: null,
    },
    {
      id: "tx2",
      type: "rent",
      status: "rented",
      createdAt: t,
      productId: "p2",
      variantId: null,
      productName: "Golf Cart",
      userId: "u2",
      userName: "Sara Khan",
      qty: 1,
      duration: 2,
      unitPriceCents: 25000,
      subtotalCents: 25000 * 2 + 50000,
      taxCents: Math.round((25000 * 2 + 50000) * 0.05),
      totalCents: Math.round((25000 * 2 + 50000) * 1.05),
      overrideTotalCents: null,
    },
    {
      id: "tx3",
      type: "rent",
      status: "returned",
      createdAt: t,
      returnedAt: t,
      productId: "p2",
      variantId: null,
      productName: "Golf Cart",
      userId: "u3",
      userName: "John Smith",
      qty: 1,
      duration: 1,
      unitPriceCents: 25000,
      subtotalCents: 25000 + 50000,
      taxCents: Math.round((25000 + 50000) * 0.05),
      totalCents: Math.round((25000 + 50000) * 1.05),
      overrideTotalCents: 70000 * 100, // override demo if you want
    },
  ];

  const invoices = [
    {
      id: "inv1",
      transactionId: "tx1",
      createdAt: t,
      status: "paid",
      type: "sale",
      userId: "u1",
      productName: "Pro V1 Balls Pack (12)",
      totalCents: 9450,
    },
    {
      id: "inv2",
      transactionId: "tx2",
      createdAt: t,
      status: "unpaid",
      type: "rent",
      userId: "u2",
      productName: "Golf Cart",
      totalCents: Math.round((25000 * 2 + 50000) * 1.05),
    },
    {
      id: "inv3",
      transactionId: "tx3",
      createdAt: t,
      status: "paid",
      type: "rent",
      userId: "u3",
      productName: "Golf Cart",
      totalCents: Math.round((25000 + 50000) * 1.05),
    },
  ];

  // AUDIT (US-10 / FR-23)
  const audit = [
    { id: "a1", at: t, adminId: "admin-1", action: "seed_demo", entity: "db", entityId: null, userId: null, meta: { note: "Seeded demo lifecycle" } },
  ];

  // NOTIFICATIONS (US-07 / FR-18)
  const notifications = [
    { id: "n1", at: t, to: "admin", userId: null, title: "Demo data seeded", message: "Lifecycle examples are ready.", kind: "success", read: false },
  ];

  return {
    users,
    products,
    transactions,
    invoices,
    audit,
    notifications,
    media: {}, // productId -> images
  };
}
