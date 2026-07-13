import { createSlice } from "@reduxjs/toolkit";
import { addDays, nightsBetween } from "@/utils/dateUtils";

const today = new Date().toISOString().slice(0, 10);

const initialState = {
  search: {
    checkIn: today,
    checkOut: addDays(today, 1),
    nights: 1,
  },
  // roomSelections keyed by roomId -> array of room instances
  roomSelections: {},
  addOns: {}, // addOnId -> { checked, adults, children }
  guestInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phoneCountry: "IN +91",
    phone: "",
    city: "",
    country: "India",
    message: "",
  },
  promo: {
    code: "",
    applied: false,
    discountAmount: 0,
    status: "idle", // idle | loading | success | error
    message: "",
  },
  paymentMethod: "razorpay",
  policyAccepted: false,
  activeTab: "property-info",
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setSearchDates(state, action) {
      const { checkIn, checkOut } = action.payload;
      state.search.checkIn = checkIn;
      state.search.checkOut = checkOut;
      state.search.nights = nightsBetween(checkIn, checkOut);
    },
    addRoomInstance(state, action) {
      const { roomId, maxAdults } = action.payload;
      if (!state.roomSelections[roomId]) state.roomSelections[roomId] = [];
      state.roomSelections[roomId].push({
        adults: 1,
        childrenUnder5: 0,
        children5to12: 0,
        mealPlan: "room-only",
      });
      void maxAdults;
    },
    removeRoomInstance(state, action) {
      const { roomId, index } = action.payload;
      if (!state.roomSelections[roomId]) return;
      state.roomSelections[roomId].splice(index, 1);
      if (state.roomSelections[roomId].length === 0) {
        delete state.roomSelections[roomId];
      }
    },
    updateRoomInstance(state, action) {
      const { roomId, index, field, value } = action.payload;
      const room = state.roomSelections[roomId]?.[index];
      if (room) room[field] = value;
    },
    setRoomQuantity(state, action) {
      const { roomId, quantity } = action.payload;
      const current = state.roomSelections[roomId] || [];
      if (quantity <= 0) {
        delete state.roomSelections[roomId];
        return;
      }
      if (quantity > current.length) {
        const toAdd = quantity - current.length;
        for (let i = 0; i < toAdd; i += 1) {
          current.push({
            adults: 1,
            childrenUnder5: 0,
            children5to12: 0,
            mealPlan: "room-only",
          });
        }
      } else {
        current.length = quantity;
      }
      state.roomSelections[roomId] = current;
    },
    toggleAddOn(state, action) {
      const { addOnId, checked } = action.payload;
      if (!state.addOns[addOnId]) {
        state.addOns[addOnId] = { checked: false, adults: 1, children: 0 };
      }
      state.addOns[addOnId].checked = checked;
    },
    updateAddOnCount(state, action) {
      const { addOnId, field, value } = action.payload;
      if (!state.addOns[addOnId]) {
        state.addOns[addOnId] = { checked: true, adults: 1, children: 0 };
      }
      state.addOns[addOnId][field] = value;
    },
    updateGuestInfo(state, action) {
      Object.assign(state.guestInfo, action.payload);
    },
    setPromoCode(state, action) {
      state.promo.code = action.payload;
    },
    promoRequestStarted(state) {
      state.promo.status = "loading";
      state.promo.message = "";
    },
    promoRequestSucceeded(state, action) {
      state.promo.status = "success";
      state.promo.applied = true;
      state.promo.discountAmount = action.payload.discountAmount;
      state.promo.message = action.payload.message;
    },
    promoRequestFailed(state, action) {
      state.promo.status = "error";
      state.promo.applied = false;
      state.promo.discountAmount = 0;
      state.promo.message = action.payload;
    },
    clearPromo(state) {
      state.promo = initialState.promo;
    },
    setPaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
    setPolicyAccepted(state, action) {
      state.policyAccepted = action.payload;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
  },
});

export const {
  setSearchDates,
  addRoomInstance,
  removeRoomInstance,
  updateRoomInstance,
  setRoomQuantity,
  toggleAddOn,
  updateAddOnCount,
  updateGuestInfo,
  setPromoCode,
  promoRequestStarted,
  promoRequestSucceeded,
  promoRequestFailed,
  clearPromo,
  setPaymentMethod,
  setPolicyAccepted,
  setActiveTab,
} = bookingSlice.actions;

export default bookingSlice.reducer;
