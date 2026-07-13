const mongoose = require("mongoose");

const roomBreakdownSchema = new mongoose.Schema(
  {
    roomNumber: { type: Number, required: true }, // 1, 2, 3... (Room 1, Room 2 in UI)
    adults: { type: Number, required: true, min: 1 },
    childrenBelow5: { type: Number, default: 0, min: 0 },
    children5to12: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const appliedAddOnSchema = new mongoose.Schema(
  {
    addOnId: { type: String, required: true },
    name: { type: String, required: true }, // snapshot, in case catalog name changes later
    pricingBasis: {
      type: String,
      enum: ["flat", "per_person"],
      required: true,
    },
    unitPriceAdult: { type: Number, default: 0 },
    unitPriceChild: { type: Number, default: 0 },
    amount: { type: Number, required: true, min: 0 }, // final computed charge for this add-on
  },
  { _id: false },
);

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, unique: true, required: true }, // BK0001, BK0002...

    // ---- Room & stay ----
    roomId: { type: String, required: true, index: true }, // ref RoomInventory.roomId
    roomSnapshot: {
      roomName: { type: String, required: true },
      roomType: { type: String, required: true },
      image: { type: String, default: "" },
      pricePerNight: { type: Number, required: true, min: 0 }, // price at time of booking (frozen)
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true, min: 1 },

    roomsCount: { type: Number, required: true, min: 1 }, // "Select Room" dropdown value
    roomsBreakdown: {
      type: [roomBreakdownSchema],
      validate: {
        validator: function (arr) {
          return arr.length === this.roomsCount;
        },
        message: "roomsBreakdown entries must match roomsCount",
      },
    },

    mealPlan: {
      type: String,
      enum: ["Room Only", "With Breakfast", "Half Board", "Full Board"],
      default: "Room Only",
    },

    // ---- Add-ons ----
    addOns: { type: [appliedAddOnSchema], default: [] },

    // ---- Promo code ----
    promoApplied: {
      code: { type: String, default: null },
      discountType: {
        type: String,
        enum: ["percentage", "flat", null],
        default: null,
      },
      discountValue: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 }, // actual INR amount deducted
    },

    // ---- Pricing breakdown (matches Reservation Summary UI) ----
    pricingBreakdown: {
      roomCharges: { type: Number, required: true, min: 0 }, // pricePerNight * nights * roomsCount
      totalDiscount: { type: Number, default: 0 }, // promo discount (deal discount reserved for future)
      taxableAmount: { type: Number, required: true, min: 0 }, // roomCharges - totalDiscount
      taxPercent: { type: Number, required: true },
      totalTaxes: { type: Number, required: true, min: 0 },
      addOnCharges: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true, min: 0 }, // what user actually pays
    },

    // ---- Guest information ----
    guestInfo: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      countryCode: { type: String, default: "+91" },
      phone: { type: String, required: true, trim: true },
      city: { type: String, trim: true, default: "" },
      country: { type: String, trim: true, default: "India" },
      specialRequest: { type: String, trim: true, default: "" },
    },

    termsAccepted: { type: Boolean, required: true },

    // ---- Status ----
    bookingStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "PaymentFailed",
        "Cancelled",
        "CheckedIn",
        "CheckedOut",
      ],
      default: "Pending",
    },

    // ---- Payment (dummy gateway for now) ----
    paymentInfo: {
      gateway: { type: String, default: "RazorpayDummy" },
      orderId: { type: String, default: null },
      paymentId: { type: String, default: null },
      signature: { type: String, default: null },
      status: {
        type: String,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending",
      },
      amountPaid: { type: Number, default: 0 },
      paidAt: { type: Date, default: null },
    },
  },
  { timestamps: true },
);

bookingSchema.index({ roomId: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model("Booking", bookingSchema, "bookings");
