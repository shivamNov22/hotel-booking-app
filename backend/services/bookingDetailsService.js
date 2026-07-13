const RoomInventory = require("../models/Room"); // same Room model created by Admin module

function calculateNights(checkIn, checkOut) {
  const oneDay = 1000 * 60 * 60 * 24;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.ceil(diff / oneDay);
}

/**
 * Builds the data needed for the Booking Details page.
 * Only projects the fields that UI actually needs — keeps this endpoint
 * decoupled from the full Admin Room schema (scalable if admin schema grows).
 */
async function getBookingDetails({ roomId, checkIn, checkOut }) {
  const room = await RoomInventory.findOne(
    { roomId },
    {
      _id: 0,
      roomId: 1,
      roomName: 1,
      roomType: 1,
      image: 1,
      basePrice: 1,
      amenities: 1,
      availabilityStatus: 1,
    },
  ).lean();

  if (!room) {
    return null;
  }

  const nights = calculateNights(checkIn, checkOut);
  const totalPrice = room.basePrice * nights;

  return {
    room: {
      roomId: room.roomId,
      roomName: room.roomName,
      roomType: room.roomType,
      image: room.image,
      amenities: room.amenities,
      // NOTE: availabilityStatus here only reflects current admin-set status
      // (Available/Occupied/Maintenance). Real date-wise availability will
      // need a Bookings collection + overlap check once the booking API is built.
      availabilityStatus: room.availabilityStatus,
    },
    pricing: {
      basePricePerNight: room.basePrice,
      nights,
      totalPrice,
    },
    stay: {
      checkIn,
      checkOut,
      nights,
    },
  };
}

module.exports = { getBookingDetails };
