const express = require("express");
const router = express.Router();

const promoController = require("../controllers/promoController");
const validate = require("../middleware/validate");
const {
  validatePromoSchema,
  createPromoSchema,
} = require("../validations/promoValidation");

router.post(
  "/validate",
  validate(validatePromoSchema),
  promoController.validatePromo,
);

router.post("/", validate(createPromoSchema), promoController.createPromo);

module.exports = router;
