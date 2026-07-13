const Joi = require("joi");

// POST /api/promo/validate
const validatePromoSchema = Joi.object({
  promoCode: Joi.string().trim().required(),
  bookingAmount: Joi.number().min(0).required(), // roomCharges (before discount) — sent by frontend for preview
});

// POST /api/admin/promo-codes (basic admin create — optional, kept minimal)
const createPromoSchema = Joi.object({
  code: Joi.string().trim().min(3).max(20).required(),
  discountType: Joi.string().valid("percentage", "flat").required(),
  discountValue: Joi.number().min(0).required(),
  maxDiscountAmount: Joi.number().min(0).allow(null),
  minBookingAmount: Joi.number().min(0).default(0),
  validFrom: Joi.date().iso().required(),
  validTill: Joi.date().iso().greater(Joi.ref("validFrom")).required(),
  usageLimit: Joi.number().integer().min(1).allow(null),
  isActive: Joi.boolean().default(true),
});

module.exports = { validatePromoSchema, createPromoSchema };
