const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const roomInventoryRoutes = require("./routes/roomInventoryRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const promoRoutes = require("./routes/promoRoutes");
const addOnRoutes = require("./routes/addOnRoutes");

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/admin/rooms", roomInventoryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/promo", promoRoutes);
app.use("/api/addons", addOnRoutes);
app.use("/api/payments", paymentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
