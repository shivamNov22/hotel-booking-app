const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      unique: true,
      required: true,
    },
    roomName: {
      type: String,
      required: true,
      trim: true,
    },
    roomType: {
      type: String,
      required: true,
      enum: ["Executive Suite", "Deluxe", "Single"],
    },
    image: {
      type: String, // image URL only
      default: "",
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    availabilityStatus: {
      type: String,
      enum: ["Available", "Occupied", "Maintenance"],
      default: "Available",
    },
    amenities: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Room", roomSchema);
