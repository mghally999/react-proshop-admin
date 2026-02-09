// src/shared/api/mock/db/seed.js
import { nowISO } from "/shared/lib/dates.js";

export function seedProducts() {
  const t = nowISO();
  return [
    {
      id: "p1",
      name: "Premium Golf Gloves (Size S)",
      sku: "GLOVE-S",
      category: "Accessories",
      priceCents: 7500,
      stock: 12,
      status: "draft",
      updatedAt: t,
    },
    {
      id: "p2",
      name: "Golf Cart (Day Rental)",
      sku: "CART-DAY",
      category: "Rental",
      priceCents: 0,
      stock: 3,
      status: "draft",
      updatedAt: t,
    },
    {
      id: "p3",
      name: "Golf Balls Pack (12)",
      sku: "BALLS-12",
      category: "Consumables",
      priceCents: 4500,
      stock: 40,
      status: "draft",
      updatedAt: t,
    },
  ];
}
