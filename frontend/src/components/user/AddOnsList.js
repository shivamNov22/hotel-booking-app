"use client";

import Skeleton from "@/components/shared/Skeleton";
import { estimateAddOnAmount } from "@/lib/pricingEstimate";

export default function AddOnsList({ addOns, isLoading, selectedIds, onToggle, totalAdults, totalChildren }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-trinity-900">Add to your stay</h2>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {!isLoading && (!addOns || addOns.length === 0) && (
        <p className="text-sm text-trinity-900/50">No add-ons available right now.</p>
      )}

      <div className="space-y-3">
        {addOns?.map((addOn) => {
          const checked = selectedIds.includes(addOn.addOnId);
          const amount = estimateAddOnAmount(addOn, totalAdults, totalChildren);
          const priceLabel =
            addOn.pricingBasis === "flat"
              ? `₹${addOn.flatPrice}`
              : `₹${addOn.pricePerAdult} Per Adult, ₹${addOn.pricePerChild} Per Child`;

          return (
            <label
              key={addOn.addOnId}
              className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-colors ${
                checked ? "border-trinity-500 bg-trinity-100/40" : "border-black/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(addOn.addOnId)}
                  className="h-4 w-4 accent-trinity-500"
                />
                <div>
                  <p className="text-sm font-medium text-trinity-900">{addOn.name}</p>
                  <p className="text-xs text-trinity-900/50">{addOn.description}</p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p className="text-trinity-900/50">{priceLabel}</p>
                <p className="font-medium text-trinity-900">₹{checked ? amount.toLocaleString("en-IN") : 0}</p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
