const User = require("../models/User");
const Admin = require("../models/Admin");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const sendTokenResponse = require("../utils/sendTokenResponse");

const registerCustomer = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, city, country } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("An account with this email already exists", 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    address,
    city,
    country,
  });

  const userSafe = user.toObject();
  delete userSafe.password;

  sendTokenResponse(userSafe, "customer", 201, "Registration successful", res);
});

const loginCustomer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const userSafe = user.toObject();
  delete userSafe.password;

  sendTokenResponse(userSafe, "customer", 200, "Login successful", res);
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await admin.matchPassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const adminSafe = admin.toObject();
  delete adminSafe.password;

  sendTokenResponse(adminSafe, "admin", 200, "Admin login successful", res);
});

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: req.user,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== "customer") {
    throw new AppError("Only customer accounts can update this profile", 403);
  }

  const allowedFields = ["name", "phone", "address", "city", "country"];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

module.exports = {
  registerCustomer,
  loginCustomer,
  loginAdmin,
  getProfile,
  updateProfile,
};
