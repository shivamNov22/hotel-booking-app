const paymentService = require("../services/paymentService");

async function createOrder(req, res) {
  try {
    const order = await paymentService.createOrder(req.body.bookingId);
    return res
      .status(200)
      .json({ success: true, message: "Order created", order });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
}

async function verifyPayment(req, res) {
  try {
    const booking = await paymentService.verifyPayment(req.body);

    if (booking.paymentInfo.status === "Paid") {
      return res.status(200).json({
        success: true,
        message: "Payment successful, booking confirmed",
        booking,
      });
    }

    return res.status(200).json({
      success: false,
      message: "Payment failed",
      booking,
    });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
}

module.exports = { createOrder, verifyPayment };
