import { createSelector } from "@reduxjs/toolkit";

const selectRoomSelections = (state) => state.booking.roomSelections;
const selectAddOnsState = (state) => state.booking.addOns;
const selectNights = (state) => state.booking.search.nights;
const selectPromo = (state) => state.booking.promo;

export const makeSelectPricing = (hotel) =>
  createSelector(
    [selectRoomSelections, selectAddOnsState, selectNights, selectPromo],
    (roomSelections, addOnsState, nights, promo) => {
      const roomLines = [];
      let roomCharges = 0;
      let roomDiscount = 0;

      Object.entries(roomSelections).forEach(([roomId, instances]) => {
        const room = hotel.rooms.find((r) => r.id === roomId);
        if (!room) return;
        instances.forEach((instance, index) => {
          const mealPlan = room.mealPlans.find(
            (m) => m.value === instance.mealPlan
          );
          const perNight = room.price + (mealPlan?.extra || 0);
          const mrpPerNight = room.mrp + (mealPlan?.extra || 0);
          const lineTotal = perNight * nights;
          const lineMrp = mrpPerNight * nights;
          roomCharges += lineMrp;
          roomDiscount += lineMrp - lineTotal;
          roomLines.push({
            roomId,
            index,
            name: room.name,
            mealPlanLabel: mealPlan?.label || "Room Only",
            adults: instance.adults,
            childrenUnder5: instance.childrenUnder5,
            children5to12: instance.children5to12,
            lineTotal,
          });
        });
      });

      const addOnLines = [];
      let addOnCharges = 0;
      Object.entries(addOnsState).forEach(([addOnId, sel]) => {
        if (!sel.checked) return;
        const addOn = hotel.addOns.find((a) => a.id === addOnId);
        if (!addOn) return;
        let lineTotal = 0;
        if (addOn.unit === "trip") {
          lineTotal = addOn.price;
        } else {
          lineTotal =
            addOn.price * (sel.adults || 0) +
            (addOn.childPrice || 0) * (sel.children || 0);
        }
        addOnCharges += lineTotal;
        addOnLines.push({ addOnId, title: addOn.title, lineTotal });
      });

      const totalCharges = roomCharges + addOnCharges;
      const totalDiscount =
        roomDiscount + (promo.applied ? promo.discountAmount : 0);
      const taxableAmount = totalCharges - totalDiscount;
      const totalTaxes = Math.round(taxableAmount * 0.05 * 100) / 100; // 5% GST assumption
      const grandTotal =
        Math.round((taxableAmount + totalTaxes) * 100) / 100;

      return {
        roomLines,
        addOnLines,
        totalCharges,
        totalDiscount,
        totalTaxes,
        grandTotal: grandTotal > 0 ? grandTotal : 0,
        hasSelection: roomLines.length > 0,
      };
    }
  );
