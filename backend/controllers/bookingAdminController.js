const asyncHandler = require("../utils/asyncHandler");
const Booking = require("../models/Booking");

// @desc    Get all bookings (Admin) with pagination, search, filter
// @route   GET /api/bookings/admin/all
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.status) {
    filter.bookingStatus = req.query.status;
  }

  if (req.query.search) {
    const regex = { $regex: req.query.search, $options: "i" };
    filter.$or = [
      { bookingId: regex },
      { "guestInfo.firstName": regex },
      { "guestInfo.lastName": regex },
      { "guestInfo.email": regex },
      { "guestInfo.phone": regex },
    ];
  }

  if (req.query.from && req.query.to) {
    filter.checkIn = {
      $gte: new Date(req.query.from),
      $lte: new Date(req.query.to),
    };
  }

  const totalBookings = await Booking.countDocuments(filter);

  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const statusCounts = await Booking.aggregate([
    { $group: { _id: "$bookingStatus", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    success: true,
    total: totalBookings,
    page,
    pages: Math.ceil(totalBookings / limit) || 1,
    count: bookings.length,
    statusCounts,
    bookings,
  });
});

module.exports = { getAllBookings };
