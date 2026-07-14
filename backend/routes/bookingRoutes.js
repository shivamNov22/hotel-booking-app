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

const bookingAdminController = require("../controllers/bookingAdminController");
// const { protect, authorize } = require("../middleware/authMiddleware"); // agar admin-protected chahiye

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

// ---- Admin: all bookings  ----
router.get(
  "/admin/all",

  bookingAdminController.getAllBookings,
);

router.post(
  "/",
  validate(createBookingSchema),
  bookingCreateController.createBooking,
);

router.get("/:bookingId", bookingCreateController.getBooking);

module.exports = router;
