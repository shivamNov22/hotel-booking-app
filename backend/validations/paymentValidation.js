const Joi = require("joi");

// POST /api/payments/create-order
const createOrderSchema = Joi.object({
  bookingId: Joi.string().trim().required(),
});

// POST /api/payments/verify
const verifyPaymentSchema = Joi.object({
  bookingId: Joi.string().trim().required(),
  orderId: Joi.string().trim().required(),
  paymentId: Joi.string().trim().required(),
  signature: Joi.string().trim().allow(""), // dummy for now; required once real gateway is wired in
  status: Joi.string().valid("success", "failed").required(), // dummy flag to simulate outcome for now
});

module.exports = { createOrderSchema, verifyPaymentSchema };
