const promoService = require("../services/promoService");

async function validatePromo(req, res) {
  try {
    const { promoCode, bookingAmount } = req.body;
    const result = await promoService.validateAndCalculateDiscount(
      promoCode,
      bookingAmount,
    );

    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      discount: {
        type: result.discountType,
        value: result.discountValue,
        amount: result.discountAmount,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// POST /api/admin/promo-codes  -> basic admin creation (optional, minimal)
async function createPromo(req, res) {
  try {
    const promo = await promoService.createPromoCode(req.body);
    return res
      .status(201)
      .json({ success: true, message: "Promo code created", promo });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Promo code already exists" });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { validatePromo, createPromo };
