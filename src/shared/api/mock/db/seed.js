import { nowISO } from "@shared/lib/dates.js";

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function seedUsers() {
  return [
    { id: "u_admin", name: "Admin", email: "admin@proshop.com", role: "admin" },
    { id: "u1", name: "Omar Ali", email: "omar@email.com", role: "customer" },
    { id: "u2", name: "Sara Noor", email: "sara@email.com", role: "customer" },
    {
      id: "u3",
      name: "Hassan Kareem",
      email: "hassan@email.com",
      role: "customer",
    },
  ];
}

export function seedProducts() {
  const t = nowISO();

  return [
    {
      id: "p1",
      name: "Premium Golf Gloves",
      sku: "GLOVE",
      category: "Accessories",
      description: "Tour-grade grip with breathable fabric.",
      productType: "sale",
      status: "active",
      isAvailable: true,
      priceCents: 7500,
      costCents: 3200,
      stock: 40,
      lowStockThreshold: 5,
      updatedAt: t,
      variants: [
        {
          id: "v1",
          name: "Size S",
          sku: "GLOVE-S",
          priceCents: 7500,
          stock: 10,
          isAvailable: true,
        },
        {
          id: "v2",
          name: "Size M",
          sku: "GLOVE-M",
          priceCents: 7500,
          stock: 20,
          isAvailable: true,
        },
        {
          id: "v3",
          name: "Size L",
          sku: "GLOVE-L",
          priceCents: 7500,
          stock: 10,
          isAvailable: true,
        },
      ],
    },
    {
      id: "p2",
      name: "Golf Cart (Daily Rental)",
      sku: "CART-DAY",
      category: "Rental",
      description: "Electric cart rental. Deposit applies.",
      productType: "rental",
      status: "active",
      isAvailable: true,
      priceCents: 0,
      costCents: 0,
      stock: 3,
      lowStockThreshold: 1,
      rental: {
        unit: "day",
        rateCents: 15000,
        flatRateCents: 0,
        depositCents: 50000,
      },
      updatedAt: t,
      variants: [],
    },
    {
      id: "p3",
      name: "Golf Balls Pack (12)",
      sku: "BALLS-12",
      category: "Consumables",
      description: "Distance + control (12 pack).",
      productType: "sale",
      status: "active",
      isAvailable: true,
      priceCents: 4500,
      costCents: 2000,
      stock: 120,
      lowStockThreshold: 10,
      updatedAt: t,
      variants: [],
    },
    {
      id: "p4",
      name: "Range Finder (Weekend Rental)",
      sku: "RANGE-RENT",
      category: "Rental",
      description: "Precision range finder. Flat weekend rate + deposit.",
      productType: "rental",
      status: "active",
      isAvailable: true,
      priceCents: 0,
      costCents: 0,
      stock: 8,
      lowStockThreshold: 2,
      rental: {
        unit: "day",
        rateCents: 0,
        flatRateCents: 22000,
        depositCents: 30000,
      },
      updatedAt: t,
      variants: [
        {
          id: "v41",
          name: "Standard Kit",
          sku: "RF-STD",
          priceCents: 0,
          stock: 5,
          isAvailable: true,
          rental: {
            unit: "day",
            rateCents: 0,
            flatRateCents: 22000,
            depositCents: 30000,
          },
        },
        {
          id: "v42",
          name: "Pro Kit",
          sku: "RF-PRO",
          priceCents: 0,
          stock: 3,
          isAvailable: true,
          rental: {
            unit: "day",
            rateCents: 0,
            flatRateCents: 30000,
            depositCents: 40000,
          },
        },
      ],
    },
  ];
}

export function seedMedia() {
  // keep urls simple; swap later with your uploader
  return [
    {
      id: "m1",
      productId: "p1",
      url: "https://picsum.photos/seed/glove/900/700",
      isPrimary: true,
      order: 1,
    },
    {
      id: "m2",
      productId: "p2",
      url: "https://picsum.photos/seed/cart/900/700",
      isPrimary: true,
      order: 1,
    },
    {
      id: "m3",
      productId: "p3",
      url: "https://picsum.photos/seed/balls/900/700",
      isPrimary: true,
      order: 1,
    },
    {
      id: "m4",
      productId: "p4",
      url: "https://picsum.photos/seed/range/900/700",
      isPrimary: true,
      order: 1,
    },
  ];
}
