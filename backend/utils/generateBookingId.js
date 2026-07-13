const Booking = require("../models/Booking");

async function generateBookingId() {
  const lastBooking = await Booking.findOne().sort({ createdAt: -1 }).lean();

  if (!lastBooking || !lastBooking.bookingId) {
    return "BK0001";
  }

  const lastNumber = parseInt(lastBooking.bookingId.replace("BK", ""), 10) || 0;
  const nextNumber = lastNumber + 1;

  return `BK${String(nextNumber).padStart(4, "0")}`;
}

module.exports = generateBookingId;
