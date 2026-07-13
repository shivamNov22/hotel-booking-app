"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setRoomQuantity,
  updateRoomInstance,
} from "@/store/slices/bookingSlice";
import { formatINR } from "@/utils/formatCurrency";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const AMENITY_LABELS = {
  ac: "Air Conditioning",
  tv: "Flat Screen TV",
  wifi: "Complimentary Wi-Fi",
  balcony: "Private Balcony",
};

export default function RoomCard({ room, nights, onBookNow }) {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const instances = useSelector(
    (state) => state.booking.roomSelections[room.id] || []
  );
  const mealPlan = instances[0]?.mealPlan || "room-only";

  const roomTotal = instances.reduce((sum, inst) => {
    const plan = room.mealPlans.find((m) => m.value === inst.mealPlan);
    return sum + (room.price + (plan?.extra || 0)) * nights;
  }, 0);

  function handleQuantityChange(e) {
    dispatch(
      setRoomQuantity({ roomId: room.id, quantity: Number(e.target.value) })
    );
  }

  function handleMealPlanChange(e) {
    instances.forEach((_, index) => {
      dispatch(
        updateRoomInstance({
          roomId: room.id,
          index,
          field: "mealPlan",
          value: e.target.value,
        })
      );
    });
  }

  function handleOccupancyChange(index, field, value) {
    dispatch(
      updateRoomInstance({ roomId: room.id, index, field, value: Number(value) })
    );
  }

  return (
    <div
      className={`rounded-lg border ${
        instances.length > 0
          ? "border-brand-orange bg-amber-50/60"
          : "border-slate-200 bg-white"
      } p-4 shadow-card sm:p-6`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="flex h-24 w-32 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 text-center text-xs text-slate-400">
            Image Not Available
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {room.name}
            </h3>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="text-sm text-brand-blue hover:underline"
            >
              See More...
            </button>
            {expanded && (
              <p className="mt-2 max-w-md text-sm text-slate-600">
                {room.description}
              </p>
            )}
            <span className="mt-2 inline-block rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
              Deal
            </span>
            <span className="ml-2 text-xs text-slate-600">{room.deal}</span>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
              {room.amenities.map((a) => (
                <span key={a}>{AMENITY_LABELS[a] || a}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right sm:min-w-[140px]">
          <span className="block text-sm text-slate-400 line-through">
            {formatINR(room.mrp)}
          </span>
          <span className="block text-xl font-bold text-slate-900">
            {formatINR(room.price)}
          </span>
          <span className="block text-xs text-slate-500">Per Night</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-dashed border-slate-200 pt-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Select
            label="Select Room"
            value={instances.length}
            onChange={handleQuantityChange}
            className="sm:w-24"
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
          <Select
            label="Meal Plan"
            value={mealPlan}
            onChange={handleMealPlanChange}
            disabled={instances.length === 0}
            className="sm:w-52"
          >
            {room.mealPlans.map((plan) => (
              <option key={plan.value} value={plan.value}>
                {plan.label}
                {plan.extra ? ` (+${formatINR(plan.extra)})` : ""}
              </option>
            ))}
          </Select>
        </div>
        {instances.length > 0 && (
          <div className="text-right">
            <span className="block text-xs text-slate-500">
              {nights} night{nights > 1 ? "s" : ""} total
            </span>
            <span className="block text-lg font-bold text-brand-navy">
              {formatINR(roomTotal)}
            </span>
          </div>
        )}
      </div>

      {instances.length > 0 && (
        <div className="mt-4 space-y-3 rounded-md bg-white/70 p-3">
          <div className="hidden grid-cols-[1fr_repeat(3,minmax(90px,1fr))_auto] gap-3 text-xs font-medium text-slate-500 sm:grid">
            <span>Room</span>
            <span>Adults</span>
            <span>Child (5-12yrs)</span>
            <span>Child (below 5yrs)</span>
            <span className="text-right">Room Price</span>
          </div>
          {instances.map((instance, index) => (
            <div
              key={index}
              className="grid grid-cols-2 items-center gap-3 border-b border-slate-100 pb-3 last:border-none last:pb-0 sm:grid-cols-[1fr_repeat(3,minmax(90px,1fr))_auto]"
            >
              <span className="text-sm font-medium text-slate-700 sm:col-auto col-span-2">
                Room {index + 1}
              </span>
              <Select
                aria-label={`Room ${index + 1} adults`}
                value={instance.adults}
                onChange={(e) =>
                  handleOccupancyChange(index, "adults", e.target.value)
                }
              >
                {Array.from({ length: room.maxAdults }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  )
                )}
              </Select>
              <Select
                aria-label={`Room ${index + 1} children 5 to 12`}
                value={instance.children5to12}
                onChange={(e) =>
                  handleOccupancyChange(
                    index,
                    "children5to12",
                    e.target.value
                  )
                }
              >
                {[0, 1, 2].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Select>
              <Select
                aria-label={`Room ${index + 1} children under 5`}
                value={instance.childrenUnder5}
                onChange={(e) =>
                  handleOccupancyChange(
                    index,
                    "childrenUnder5",
                    e.target.value
                  )
                }
              >
                {[0, 1, 2].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Select>
              <span className="text-right text-sm font-semibold text-slate-700 sm:text-right">
                {formatINR(
                  (room.price +
                    (room.mealPlans.find((m) => m.value === instance.mealPlan)
                      ?.extra || 0)) *
                    nights
                )}
              </span>
            </div>
          ))}
          <div className="pt-2 text-right">
            <Button variant="confirm" onClick={onBookNow}>
              Book Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
