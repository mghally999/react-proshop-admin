function applyOffer(baseCents, offer) {
  if (!offer) return { finalCents: baseCents, discountCents: 0 };

  if (offer.type === "percent") {
    const disc = Math.round(baseCents * (Number(offer.value || 0) / 100));
    return { finalCents: baseCents - disc, discountCents: disc };
  }

  if (offer.type === "flat") {
    const disc = Math.min(baseCents, Number(offer.value || 0));
    return { finalCents: baseCents - disc, discountCents: disc };
  }

  return { finalCents: baseCents, discountCents: 0 };
}

export function computeSalePricing({ product, variant, qty }) {
  const baseUnit = Number(variant?.priceCents ?? product.priceCents ?? 0);
  const offer = variant?.offer ?? product.offer ?? null;

  const { finalCents, discountCents } = applyOffer(baseUnit, offer);
  return {
    unitBaseCents: baseUnit,
    unitFinalCents: finalCents,
    unitDiscountCents: discountCents,
    lineBaseCents: baseUnit * qty,
    lineFinalCents: finalCents * qty,
    lineDiscountCents: discountCents * qty,
  };
}

export function computeRentalPricing({ product, variant, duration }) {
  const r = variant?.rental ?? product.rental;
  if (!r) return { baseCents: 0, finalCents: 0, discountCents: 0, depositCents: 0 };

  const d = Math.max(1, Number(duration || 1));
  const base = Number(r.rateCents || 0) * d;
  const { finalCents, discountCents } = applyOffer(base, r.offer ?? null);
  const deposit = Number(r.depositCents || 0);

  return {
    baseCents: base,
    finalCents: finalCents + deposit,
    discountCents,
    depositCents: deposit,
    unit: r.unit || "day",
  };
}
