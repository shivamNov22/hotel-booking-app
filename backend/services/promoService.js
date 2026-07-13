const PromoCode = require("../models/PromoCode");

/**
 * Validates a promo code against current date, usage limits, and min booking
 * amount, then computes the discount amount for the given bookingAmount
 * (roomCharges). Used by BOTH:
 *   - POST /api/promo/validate   (preview, before booking is created)
 *   - booking creation flow      (final authoritative check, server-side)
 */
async function validateAndCalculateDiscount(promoCodeInput, bookingAmount) {
  const promo = await PromoCode.findOne({
    code: promoCodeInput.trim().toUpperCase(),
    isActive: true,
  });

  if (!promo) {
    return {
      valid: false,
      message: "Invalid or inactive promo code",
      discountAmount: 0,
    };
  }

  const now = new Date();
  if (now < promo.validFrom || now > promo.validTill) {
    return {
      valid: false,
      message: "Promo code has expired or is not yet active",
      discountAmount: 0,
    };
  }

  if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
    return {
      valid: false,
      message: "Promo code usage limit reached",
      discountAmount: 0,
    };
  }

  if (bookingAmount < promo.minBookingAmount) {
    return {
      valid: false,
      message: `Minimum booking amount of ${promo.minBookingAmount} required for this promo code`,
      discountAmount: 0,
    };
  }

  let discountAmount = 0;
  if (promo.discountType === "percentage") {
    discountAmount = (bookingAmount * promo.discountValue) / 100;
    if (promo.maxDiscountAmount !== null) {
      discountAmount = Math.min(discountAmount, promo.maxDiscountAmount);
    }
  } else {
    // flat
    discountAmount = promo.discountValue;
  }

  // Never let discount exceed the bookable amount
  discountAmount = Math.min(discountAmount, bookingAmount);

  return {
    valid: true,
    message: "Promo code applied successfully",
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    discountAmount: Math.round(discountAmount * 100) / 100,
  };
}

async function incrementUsage(code) {
  await PromoCode.updateOne(
    { code: code.trim().toUpperCase() },
    { $inc: { usedCount: 1 } },
  );
}

async function createPromoCode(data) {
  const promo = await PromoCode.create(data);
  return promo;
}

module.exports = {
  validateAndCalculateDiscount,
  incrementUsage,
  createPromoCode,
};
