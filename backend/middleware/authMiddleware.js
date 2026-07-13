const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const User = require("../models/User");
const Admin = require("../models/Admin");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new AppError("Not authorized, no token provided", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError("Not authorized, invalid or expired token", 401);
  }

  const account =
    decoded.role === "admin"
      ? await Admin.findById(decoded.id)
      : await User.findById(decoded.id);

  if (!account) {
    throw new AppError("Not authorized, account no longer exists", 401);
  }

  req.user = account;
  req.user.role = decoded.role;
  next();
});

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `Role '${req.user.role}' is not allowed to access this resource`,
        403,
      );
    }
    next();
  };

module.exports = { protect, authorize };
