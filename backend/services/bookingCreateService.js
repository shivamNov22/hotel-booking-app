const RoomInventory = require("../models/Room");
const Booking = require("../models/Booking");
const generateBookingId = require("../utils/generateBookingId");
const promoService = require("./promoService");
const addOnService = require("./addOnService");
const { TAX_PERCENT } = require("../config/pricingConfig");

function appError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function calculateNights(checkIn, checkOut) {
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.ceil((new Date(checkOut) - new Date(checkIn)) / oneDay);
}

/**
 * Creates a booking in "Pending" state with a fully server-computed price
 * breakdown. Nothing about pricing is trusted from the frontend except
 * quantities/selections (rooms, pax counts, addon IDs, promo code) —
 * every rate comes from the DB (RoomInventory, AddOn, PromoCode).
 */
async function createBooking(payload) {
  const {
    roomId,
    checkIn,
    checkOut,
    roomsCount,
    roomsBreakdown,
    mealPlan,
    addOnIds,
    promoCode,
    guestInfo,
    termsAccepted,
  } = payload;

  // 1. Room validation
  const room = await RoomInventory.findOne({ roomId }).lean();
  if (!room) throw appError("Room not found for the given roomId", 404);
  if (room.availabilityStatus !== "Available") {
    throw appError(
      `Room is currently ${room.availabilityStatus} and cannot be booked`,
      400,
    );
  }

  // 2. Rooms breakdown sanity check
  if (roomsBreakdown.length !== roomsCount) {
    throw appError("roomsBreakdown entries must match roomsCount", 400);
  }

  const nights = calculateNights(checkIn, checkOut);

  // 3. Pax totals (used for per-person add-ons)
  let totalAdults = 0;
  let totalChildren = 0; // both age brackets combined, see AddOn note
  roomsBreakdown.forEach((r) => {
    totalAdults += r.adults;
    totalChildren += (r.childrenBelow5 || 0) + (r.children5to12 || 0);
  });

  // 4. Room charges
  const roomCharges = room.basePrice * nights * roomsCount;

  // 5. Promo discount (server-side authoritative check — re-validated even if
  // the frontend already showed a preview via /api/promo/validate)
  let promoApplied = {
    code: null,
    discountType: null,
    discountValue: 0,
    discountAmount: 0,
  };
  if (promoCode) {
    const result = await promoService.validateAndCalculateDiscount(
      promoCode,
      roomCharges,
    );
    if (!result.valid) {
      throw appError(result.message, 400);
    }
    promoApplied = {
      code: promoCode.trim().toUpperCase(),
      discountType: result.discountType,
      discountValue: result.discountValue,
      discountAmount: result.discountAmount,
    };
  }

  const totalDiscount = promoApplied.discountAmount;
  const taxableAmount = roomCharges - totalDiscount;
  const totalTaxes =
    Math.round(((taxableAmount * TAX_PERCENT) / 100) * 100) / 100;

  // 6. Add-ons — fetch real prices from catalog, never trust frontend-sent prices
  const addOnDocs = await addOnService.getAddOnsByIds(addOnIds);
  if (addOnDocs.length !== addOnIds.length) {
    throw appError("One or more selected add-ons are invalid or inactive", 400);
  }

  const appliedAddOns = addOnDocs.map((a) => {
    let amount = 0;
    if (a.pricingBasis === "flat") {
      amount = a.flatPrice;
    } else {
      amount = a.pricePerAdult * totalAdults + a.pricePerChild * totalChildren;
    }
    return {
      addOnId: a.addOnId,
      name: a.name,
      pricingBasis: a.pricingBasis,
      unitPriceAdult: a.pricePerAdult,
      unitPriceChild: a.pricePerChild,
      amount: Math.round(amount * 100) / 100,
    };
  });

  const addOnCharges = appliedAddOns.reduce((sum, a) => sum + a.amount, 0);

  // 7. Grand total
  const grandTotal =
    Math.round((taxableAmount + totalTaxes + addOnCharges) * 100) / 100;

  // 8. Persist
  const bookingId = await generateBookingId();

  const booking = await Booking.create({
    bookingId,
    roomId,
    roomSnapshot: {
      roomName: room.roomName,
      roomType: room.roomType,
      image: room.image,
      pricePerNight: room.basePrice,
    },
    checkIn,
    checkOut,
    nights,
    roomsCount,
    roomsBreakdown,
    mealPlan,
    addOns: appliedAddOns,
    promoApplied,
    pricingBreakdown: {
      roomCharges,
      totalDiscount,
      taxableAmount,
      taxPercent: TAX_PERCENT,
      totalTaxes,
      addOnCharges,
      grandTotal,
    },
    guestInfo,
    termsAccepted,
    bookingStatus: "Pending",
  });

  return booking;
}

async function getBookingByBookingId(bookingId) {
  return Booking.findOne({ bookingId }).lean();
}

/**
 * Shapes a raw Booking document into exactly what the Booking Confirmation
 * UI (Image 2) needs — Stay Details, Guest Information, Rooms Breakdown,
 * Invoice Summary, Payment Information. Deliberately excludes internal
 * payment fields (e.g. gateway signature) that the client never needs to see.
 */
function formatBookingConfirmation(booking) {
  return {
    bookingId: booking.bookingId,
    bookingStatus: booking.bookingStatus,
    stayDetails: {
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights: booking.nights,
      roomsCount: booking.roomsCount,
    },
    room: {
      roomName: booking.roomSnapshot.roomName,
      roomType: booking.roomSnapshot.roomType,
      image: booking.roomSnapshot.image,
      pricePerNight: booking.roomSnapshot.pricePerNight,
      mealPlan: booking.mealPlan,
    },
    roomsBreakdown: booking.roomsBreakdown,
    addOns: booking.addOns,
    guestInfo: booking.guestInfo,
    promoApplied: booking.promoApplied,
    pricingBreakdown: booking.pricingBreakdown,
    paymentInfo: {
      status: booking.paymentInfo.status,
      amountPaid: booking.paymentInfo.amountPaid,
      paymentId: booking.paymentInfo.paymentId,
      orderId: booking.paymentInfo.orderId,
      paidAt: booking.paymentInfo.paidAt,
      // signature intentionally omitted — server-side verification detail only
    },
  };
}

/**
 * Used right after payment redirect — frontend already knows the bookingId
 * from its own flow (same session), so no extra identity check needed here.
 */
async function getBookingConfirmation(bookingId) {
  const booking = await Booking.findOne({ bookingId }).lean();
  if (!booking) return null;
  return formatBookingConfirmation(booking);
}

/**
 * Used by the public "My Bookings" search form (Image 1) — bookingId alone
 * is guessable (BK0001, BK0002...), so email must match the booking's guest
 * email too. On any mismatch we return the SAME generic "not found" result
 * for both a wrong bookingId and a wrong email, so the endpoint can't be used
 * to check whether a given email made a booking (no enumeration).
 */
async function getBookingForLookup(bookingId, email) {
  const booking = await Booking.findOne({ bookingId }).lean();
  if (!booking) return null;

  const emailMatches =
    booking.guestInfo.email.toLowerCase() === email.trim().toLowerCase();
  if (!emailMatches) return null;

  return formatBookingConfirmation(booking);
}

module.exports = {
  createBooking,
  getBookingByBookingId,
  getBookingConfirmation,
  getBookingForLookup,
  appError,
};
