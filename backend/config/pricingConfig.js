// Centralized pricing config — change here, not scattered across services.
module.exports = {
  TAX_PERCENT: 5, // GST/service tax % applied on (roomCharges - discount)
  CURRENCY: "INR",
  PAYMENT_GATEWAY: "RazorpayDummy", // replace with "Razorpay" when real keys are wired in
};
