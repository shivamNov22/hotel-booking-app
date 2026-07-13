const mongoose = require("mongoose");

const addOnSchema = new mongoose.Schema(
  {
    addOnId: {
      type: String,
      required: true,
      unique: true, // e.g. ADDON001
    },
    name: { type: String, required: true, trim: true }, // "Airport Pick Up Charges"
    description: { type: String, trim: true, default: "" }, // "Airport Pick Up Charges (one way)"

    // Two pricing styles seen in the UI:
    // - "flat": one fixed charge regardless of pax (e.g. Railway Station Pick Up = INR 600 total)
    // - "per_person": charged per adult / per child, summed across all rooms
    //                 (e.g. Dinner = INR 300 per adult, INR 150 per child)
    pricingBasis: {
      type: String,
      enum: ["flat", "per_person"],
      required: true,
    },
    flatPrice: {
      type: Number,
      default: 0,
      min: 0, // used only when pricingBasis = "flat"
    },
    pricePerAdult: {
      type: Number,
      default: 0,
      min: 0, // used only when pricingBasis = "per_person"
    },
    pricePerChild: {
      type: Number,
      default: 0,
      min: 0, // used only when pricingBasis = "per_person"
    },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AddOn", addOnSchema, "add_ons");
