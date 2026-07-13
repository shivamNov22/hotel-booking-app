const Joi = require("joi");

// GET /api/bookings/lookup?bookingId=BK0001&email=shivam@example.com
const lookupBookingQuerySchema = Joi.object({
  bookingId: Joi.string().trim().required().messages({
    "any.required": "Booking Ref. Number is required",
  }),
  email: Joi.string().trim().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Enter a valid email address",
  }),
});

module.exports = { lookupBookingQuerySchema };
