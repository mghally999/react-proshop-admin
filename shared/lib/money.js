// src/shared/lib/money.js

export function formatMoneyFromCents(cents, currency = "AED") {
  const value = Number(cents ?? 0) / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatMoney(value, currency = "AED", locale = "en-US") {
  const n = typeof value === "number" ? value : Number(value ?? 0);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);
}
