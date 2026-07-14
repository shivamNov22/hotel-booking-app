// ⚠️ ESTIMATED_TAX_PERCENT below must match your backend's
// config/pricingConfig.js → TAX_PERCENT. There's currently no public endpoint
// exposing this value, so it's duplicated here for the live on-page preview.
// If it ever changes on the backend, update it here too — or better, add a
// small `GET /api/config/pricing` endpoint later so both sides read the same
// source of truth. The number shown here is only a preview; the authoritative
// total always comes back from POST /api/bookings.
export const ESTIMATED_TAX_PERCENT = 5;

export function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const oneDay = 1000 * 60 * 60 * 24;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, Math.round(diff / oneDay));
}

export function estimateAddOnAmount(addOn, totalAdults, totalChildren) {
  if (addOn.pricingBasis === "flat") return addOn.flatPrice || 0;
  return (addOn.pricePerAdult || 0) * totalAdults + (addOn.pricePerChild || 0) * totalChildren;
}

/**
 * Builds a live Reservation Summary preview from current UI state.
 * roomsBreakdown: [{ adults, childrenBelow5, children5to12 }]
 * selectedAddOns: array of AddOn catalog objects the user has checked
 * promoDiscountAmount: number (from the last successful /promo/validate call), 0 if none
 */
export function estimatePricing({
  basePrice,
  nights,
  roomsCount,
  roomsBreakdown,
  selectedAddOns,
  promoDiscountAmount = 0,
}) {
  const roomCharges = basePrice * nights * roomsCount;

  const totalAdults = roomsBreakdown.reduce((sum, r) => sum + (r.adults || 0), 0);
  const totalChildren = roomsBreakdown.reduce(
    (sum, r) => sum + (r.childrenBelow5 || 0) + (r.children5to12 || 0),
    0
  );

  const totalDiscount = Math.min(promoDiscountAmount, roomCharges);
  const taxableAmount = roomCharges - totalDiscount;
  const totalTaxes = Math.round(((taxableAmount * ESTIMATED_TAX_PERCENT) / 100) * 100) / 100;

  const addOnCharges = selectedAddOns.reduce(
    (sum, addOn) => sum + estimateAddOnAmount(addOn, totalAdults, totalChildren),
    0
  );

  const grandTotal = Math.round((taxableAmount + totalTaxes + addOnCharges) * 100) / 100;

  return {
    roomCharges,
    totalDiscount,
    taxableAmount,
    taxPercent: ESTIMATED_TAX_PERCENT,
    totalTaxes,
    addOnCharges,
    grandTotal,
    totalAdults,
    totalChildren,
  };
}
