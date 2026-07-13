const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");
const validate = require("../middleware/validate");
const {
  createOrderSchema,
  verifyPaymentSchema,
} = require("../validations/paymentValidation");

router.post(
  "/create-order",
  validate(createOrderSchema),
  paymentController.createOrder,
);

router.post(
  "/verify",
  validate(verifyPaymentSchema),
  paymentController.verifyPayment,
);

module.exports = router;
