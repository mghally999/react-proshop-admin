import { nowISO } from "@shared/lib/dates.js";

/**
 * SALE PRICING
 */
export function computeSaleTotal({
  unitPriceCents,
  qty,
  overrideTotalCents,
}) {
  if (overrideTotalCents != null) {
    return overrideTotalCents;
  }

  return unitPriceCents * Math.max(1, qty);
}

/**
 * RENTAL PRICING
 */
export function computeRentalTotal({
  rateCents,
  duration,
  depositCents = 0,
  flatRateCents = 0,
  overrideTotalCents,
}) {
  if (overrideTotalCents != null) {
    return overrideTotalCents;
  }

  const d = Math.max(1, duration);
  const base = flatRateCents > 0 ? flatRateCents : rateCents * d;

  return base + depositCents;
}
