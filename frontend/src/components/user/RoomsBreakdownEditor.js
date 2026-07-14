"use client";

import { X } from "lucide-react";

const MEAL_PLANS = ["Room Only", "With Breakfast", "Half Board", "Full Board"];
const MAX_ROOMS = 4;

export default function RoomsBreakdownEditor({
  roomsCount,
  roomsBreakdown,
  mealPlan,
  pricePerNight,
  nights,
  onRoomsCountChange,
  onRoomsBreakdownChange,
  onMealPlanChange,
}) {
  const updateRoom = (index, field, value) => {
    const next = roomsBreakdown.map((r, i) => (i === index ? { ...r, [field]: value } : r));
    onRoomsBreakdownChange(next);
  };

  const removeRoom = (index) => {
    onRoomsCountChange(roomsCount - 1);
    onRoomsBreakdownChange(roomsBreakdown.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-trinity-900/70">
          Select Room
          <select
            value={roomsCount}
            onChange={(e) => onRoomsCountChange(Number(e.target.value))}
            className="rounded-lg border border-black/10 px-3 py-1.5 text-sm focus:border-trinity-500 focus:outline-none"
          >
            {Array.from({ length: MAX_ROOMS + 1 }).map((_, n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-trinity-900/70">
          Meal Plan
          <select
            value={mealPlan}
            onChange={(e) => onMealPlanChange(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-1.5 text-sm focus:border-trinity-500 focus:outline-none"
          >
            {MEAL_PLANS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>

      {roomsCount > 0 && (
        <div className="overflow-x-auto rounded-xl bg-cream/60">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-trinity-900/50">
                <th className="px-4 py-2 font-medium"> </th>
                <th className="px-4 py-2 font-medium">Adults</th>
                <th className="px-4 py-2 font-medium">Child (below 5yrs)</th>
                <th className="px-4 py-2 font-medium">Child (5-12yrs)</th>
                <th className="px-4 py-2 text-right font-medium">Room Price</th>
              </tr>
            </thead>
            <tbody>
              {roomsBreakdown.map((room, i) => (
                <tr key={i} className="border-t border-black/5">
                  <td className="px-4 py-2 font-medium text-trinity-900">
                    Room {i + 1}{" "}
                    <button
                      type="button"
                      onClick={() => removeRoom(i)}
                      className="ml-1 align-middle text-trinity-900/40 hover:text-red-600"
                      aria-label={`Remove room ${room.roomNumber}`}
                    >
                      <X size={14} className="inline" />
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={room.adults}
                      onChange={(e) => updateRoom(i, "adults", Number(e.target.value))}
                      className="rounded-md border border-black/10 px-2 py-1 text-sm"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={room.childrenBelow5}
                      onChange={(e) => updateRoom(i, "childrenBelow5", Number(e.target.value))}
                      className="rounded-md border border-black/10 px-2 py-1 text-sm"
                    >
                      {[0, 1, 2, 3].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={room.children5to12}
                      onChange={(e) => updateRoom(i, "children5to12", Number(e.target.value))}
                      className="rounded-md border border-black/10 px-2 py-1 text-sm"
                    >
                      {[0, 1, 2, 3].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-right text-trinity-900">
                    ₹{(pricePerNight * nights).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
