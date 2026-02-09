// src/modules/proshop/products/domain/product.status.js
export const PRODUCT_STATUS = Object.freeze({
  DRAFT: "draft",
  ACTIVE: "active",
  ARCHIVED: "archived",
});

export const STOCK_STATUS = Object.freeze({
  OUT: "out",
  LOW: "low",
  OK: "ok",
});

export function getStockStatusKey(stockQty) {
  const n = Number(stockQty);
  if (!Number.isFinite(n) || n <= 0) return STOCK_STATUS.OUT;
  if (n <= 5) return STOCK_STATUS.LOW;
  return STOCK_STATUS.OK;
}
