const express = require("express");
const { body } = require("express-validator");
const {
  registerCustomer,
  loginCustomer,
  loginAdmin,
  getProfile,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("A valid phone number is required"),
];

const loginValidation = [
  body("email").isEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registerValidation, validateRequest, registerCustomer);
router.post("/login", loginValidation, validateRequest, loginCustomer);
router.post("/admin/login", loginValidation, validateRequest, loginAdmin);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;
