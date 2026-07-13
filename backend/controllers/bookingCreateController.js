const bookingCreateService = require("../services/bookingCreateService");

async function createBooking(req, res) {
  try {
    const booking = await bookingCreateService.createBooking(req.body);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully, proceed to payment",
      booking,
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
}

async function getBooking(req, res) {
  try {
    const booking = await bookingCreateService.getBookingConfirmation(
      req.params.bookingId,
    );
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    return res.status(200).json({ success: true, booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function lookupBooking(req, res) {
  try {
    const { bookingId, email } = req.query;
    const booking = await bookingCreateService.getBookingForLookup(
      bookingId,
      email,
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "No booking found for this reference number and email",
      });
    }

    return res.status(200).json({ success: true, booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { createBooking, getBooking, lookupBooking };
