const generateToken = require("./generateToken");

const sendTokenResponse = (account, role, statusCode, message, res) => {
  const token = generateToken(account._id, role);

  const cookieExpiresDays = Number(process.env.COOKIE_EXPIRES_DAYS) || 7;
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpiresDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  res.cookie("token", token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    data: account,
  });
};

module.exports = sendTokenResponse;
