const bookingService = require("../services/bookingDetailsService");

async function getBookingDetails(req, res) {
  try {
    const { roomId, checkIn, checkOut } = req.query;

    const data = await bookingService.getBookingDetails({
      roomId,
      checkIn,
      checkOut,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Room not found for the given roomId",
      });
    }

    if (data.room.availabilityStatus !== "Available") {
      return res.status(400).json({
        success: false,
        message: `Room is currently ${data.room.availabilityStatus} and cannot be booked`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking details fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getBookingDetails };
