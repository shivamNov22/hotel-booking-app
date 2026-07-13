require("dotenv").config();
const mongoose = require("mongoose");
const AddOn = require("../models/AddOn");

const addOnsData = [
  {
    addOnId: "ADDON001",
    name: "Airport Pick Up Charges",
    description: "Airport Pick Up Charges (one way)",
    pricingBasis: "flat",
    flatPrice: 1100,
    isActive: true,
  },
  {
    addOnId: "ADDON002",
    name: "Dinner Charges",
    description: "Dinner Charges (Veg or Non Veg)",
    pricingBasis: "per_person",
    pricePerAdult: 300,
    pricePerChild: 150,
    isActive: true,
  },
  {
    addOnId: "ADDON003",
    name: "Lunch Charges",
    description: "Lunch Charges (Veg or Non Veg)",
    pricingBasis: "per_person",
    pricePerAdult: 300,
    pricePerChild: 150,
    isActive: true,
  },
  {
    addOnId: "ADDON004",
    name: "Railway Station Pick Up Charges",
    description: "Railway Station Pick Up Charges (one way)",
    pricingBasis: "flat",
    flatPrice: 600,
    isActive: true,
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    for (const addOn of addOnsData) {
      await AddOn.updateOne(
        { addOnId: addOn.addOnId },
        { $set: addOn },
        { upsert: true },
      );
      console.log(`Seeded: ${addOn.addOnId} - ${addOn.name}`);
    }

    console.log("Add-on catalog seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed add-ons:", error.message);
    process.exit(1);
  }
})();
