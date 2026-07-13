const crypto = require("crypto");

function generateDummyOrderId() {
  return "order_" + crypto.randomBytes(8).toString("hex");
}

function generateDummyPaymentId() {
  return "pay_" + crypto.randomBytes(8).toString("hex");
}

module.exports = { generateDummyOrderId, generateDummyPaymentId };
