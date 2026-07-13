const Joi = require("joi");

// GET /api/bookings/details?roomId=RS001&checkIn=2026-08-01&checkOut=2026-08-02
const getBookingDetailsQuerySchema = Joi.object({
  roomId: Joi.string().trim().required().messages({
    "any.required": "roomId is required",
  }),
  checkIn: Joi.date().iso().required().messages({
    "any.required": "checkIn date is required",
    "date.format": "checkIn must be a valid date (YYYY-MM-DD)",
  }),
  checkOut: Joi.date().iso().required().greater(Joi.ref("checkIn")).messages({
    "any.required": "checkOut date is required",
    "date.format": "checkOut must be a valid date (YYYY-MM-DD)",
    "date.greater": "checkOut must be after checkIn",
  }),
});

module.exports = { getBookingDetailsQuerySchema };
