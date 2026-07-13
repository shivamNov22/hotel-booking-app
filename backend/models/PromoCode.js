const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true, // "SAVE10" always stored uppercase, matched case-insensitively
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
      // if discountType = percentage, this is e.g. 10 (meaning 10%)
      // if discountType = flat, this is a flat INR amount e.g. 500
    },
    maxDiscountAmount: {
      type: Number,
      default: null,
      // caps the discount for percentage-type codes (e.g. max INR 1000 off), ignored for flat type
    },
    minBookingAmount: {
      type: Number,
      default: 0,
      // promo only valid if roomCharges >= this amount
    },
    validFrom: { type: Date, required: true },
    validTill: { type: Date, required: true },
    usageLimit: {
      type: Number,
      default: null, // null = unlimited
    },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("PromoCode", promoCodeSchema, "promo_codes");
