const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate");

const bookingDetailsController = require("../controllers/bookingDetailsController");
const {
  getBookingDetailsQuerySchema,
} = require("../validations/bookingDetailsValidation");

const bookingCreateController = require("../controllers/bookingCreateController");
const {
  createBookingSchema,
} = require("../validations/bookingCreateValidation");
const {
  lookupBookingQuerySchema,
} = require("../validations/bookingLookupValidation");

router.get(
  "/details",
  validate(getBookingDetailsQuerySchema, "query"),
  bookingDetailsController.getBookingDetails,
);

router.get(
  "/lookup",
  validate(lookupBookingQuerySchema, "query"),
  bookingCreateController.lookupBooking,
);

router.post(
  "/",
  validate(createBookingSchema),
  bookingCreateController.createBooking,
);

router.get("/:bookingId", bookingCreateController.getBooking);

module.exports = router;
