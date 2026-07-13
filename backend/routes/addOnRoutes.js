const express = require("express");
const router = express.Router();

const addOnController = require("../controllers/addOnController");

// GET /api/addons -> "Add to your stay" section
router.get("/", addOnController.getAddOns);

module.exports = router;
