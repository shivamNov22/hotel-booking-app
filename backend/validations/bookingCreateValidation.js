const Joi = require("joi");

const roomBreakdownItem = Joi.object({
  roomNumber: Joi.number().integer().min(1).required(),
  adults: Joi.number().integer().min(1).required(),
  childrenBelow5: Joi.number().integer().min(0).default(0),
  children5to12: Joi.number().integer().min(0).default(0),
});

const guestInfoSchema = Joi.object({
  firstName: Joi.string().trim().min(1).required(),
  lastName: Joi.string().trim().min(1).required(),
  email: Joi.string().trim().email().required(),
  countryCode: Joi.string().trim().default("+91"),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{7,15}$/)
    .required()
    .messages({ "string.pattern.base": "phone must be 7-15 digits" }),
  city: Joi.string().trim().allow(""),
  country: Joi.string().trim().default("India"),
  specialRequest: Joi.string().trim().allow(""),
});

// POST /api/bookings
const createBookingSchema = Joi.object({
  roomId: Joi.string().trim().required(),
  checkIn: Joi.date().iso().required(),
  checkOut: Joi.date().iso().greater(Joi.ref("checkIn")).required(),

  roomsCount: Joi.number().integer().min(1).required(),
  roomsBreakdown: Joi.array().items(roomBreakdownItem).min(1).required(),

  mealPlan: Joi.string()
    .valid("Room Only", "With Breakfast", "Half Board", "Full Board")
    .default("Room Only"),

  addOnIds: Joi.array().items(Joi.string().trim()).default([]), // just IDs — prices fetched server-side from AddOn catalog

  promoCode: Joi.string().trim().allow(null, ""),

  guestInfo: guestInfoSchema.required(),

  termsAccepted: Joi.boolean().valid(true).required().messages({
    "any.only": "Guest must accept Reservation & Cancellation Policy",
  }),
});

module.exports = { createBookingSchema };
