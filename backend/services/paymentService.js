const Booking = require("../models/Booking");
const promoService = require("./promoService");
const { generateDummyOrderId } = require("../utils/dummyPaymentGateway");
const { CURRENCY, PAYMENT_GATEWAY } = require("../config/pricingConfig");

function appError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

/**
 * Creates a payment order for a Pending booking.
 * DUMMY implementation — swap the inside of this function for a real
 * gateway call later, e.g.:
 *   const order = await razorpay.orders.create({ amount, currency, receipt: bookingId });
 * Everything else (booking lookup, status checks, response shape) stays the same.
 */
async function createOrder(bookingId) {
  const booking = await Booking.findOne({ bookingId });
  if (!booking) throw appError("Booking not found", 404);

  if (booking.bookingStatus !== "Pending") {
    throw appError(
      `Booking is already ${booking.bookingStatus}, cannot initiate payment`,
      400,
    );
  }
  if (booking.paymentInfo.status === "Paid") {
    throw appError("Booking is already paid", 400);
  }

  const orderId = generateDummyOrderId();
  const amountInPaise = Math.round(booking.pricingBreakdown.grandTotal * 100);

  booking.paymentInfo.orderId = orderId;
  booking.paymentInfo.gateway = PAYMENT_GATEWAY;
  await booking.save();

  return {
    orderId,
    amount: amountInPaise, // gateways like Razorpay expect amount in smallest currency unit
    currency: CURRENCY,
    bookingId: booking.bookingId,
    // In real integration you'd also return the gateway's public key here for the frontend widget
  };
}

/**
 * Verifies payment result and updates booking + payment status.
 * DUMMY implementation — `status` is currently passed in directly by the
 * frontend/test to simulate success or failure. Replace with real signature
 * verification later, e.g.:
 *   const expected = crypto.createHmac("sha256", RAZORPAY_SECRET)
 *                          .update(orderId + "|" + paymentId).digest("hex");
 *   const isValid = expected === signature;
 */
async function verifyPayment({
  bookingId,
  orderId,
  paymentId,
  signature,
  status,
}) {
  const booking = await Booking.findOne({ bookingId });
  if (!booking) throw appError("Booking not found", 404);

  if (booking.paymentInfo.orderId !== orderId) {
    throw appError("Order ID does not match this booking", 400);
  }

  if (status === "success") {
    booking.paymentInfo.paymentId = paymentId;
    booking.paymentInfo.signature = signature || null;
    booking.paymentInfo.status = "Paid";
    booking.paymentInfo.amountPaid = booking.pricingBreakdown.grandTotal;
    booking.paymentInfo.paidAt = new Date();
    booking.bookingStatus = "Confirmed";

    if (booking.promoApplied && booking.promoApplied.code) {
      await promoService.incrementUsage(booking.promoApplied.code);
    }
  } else {
    booking.paymentInfo.status = "Failed";
    booking.bookingStatus = "PaymentFailed";
  }

  await booking.save();
  return booking;
}

module.exports = { createOrder, verifyPayment };
