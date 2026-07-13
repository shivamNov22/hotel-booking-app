"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { formatINR } from "@/utils/formatCurrency";
import { formatDisplayDate } from "@/utils/dateUtils";

export default function ReservationSummary({ pricing }) {
  const search = useSelector((state) => state.booking.search);
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <section
      aria-labelledby="summary-heading"
      className="rounded-lg border border-slate-200 bg-white shadow-card"
    >
      <h2
        id="summary-heading"
        className="rounded-t-lg bg-brand-blue px-4 py-3 text-base font-semibold text-white"
      >
        Reservation Summary
      </h2>
      <div className="p-4">
        <div className="flex items-start justify-between text-sm">
          <div>
            <span className="text-slate-500">Check In</span>
            <p className="font-semibold text-slate-800">
              {formatDisplayDate(search.checkIn)}
            </p>
          </div>
          <span className="rounded bg-brand-blue px-2 py-0.5 text-xs font-semibold text-white">
            {search.nights} night{search.nights > 1 ? "s" : ""}
          </span>
          <div className="text-right">
            <span className="text-slate-500">Check Out</span>
            <p className="font-semibold text-slate-800">
              {formatDisplayDate(search.checkOut)}
            </p>
          </div>
        </div>

        {pricing.roomLines.length > 0 && (
          <div className="mt-4 space-y-3 border-t border-slate-100 pt-3">
            {pricing.roomLines.map((line, i) => (
              <div key={i} className="text-sm">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>{line.name}</span>
                  <span>{formatINR(line.lineTotal)}</span>
                </div>
                <p className="text-xs text-slate-500">
                  Meal Plan: {line.mealPlanLabel} &middot; Adults:{" "}
                  {line.adults}, Child (&lt;5): {line.childrenUnder5}, Child
                  (5-12): {line.children5to12}
                </p>
              </div>
            ))}
          </div>
        )}

        {pricing.addOnLines.length > 0 && (
          <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-sm">
            {pricing.addOnLines.map((line) => (
              <div key={line.addOnId} className="flex justify-between">
                <span className="text-slate-600">{line.title}</span>
                <span className="font-medium text-slate-700">
                  {formatINR(line.lineTotal)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Total Charges</span>
            <span className="font-medium text-slate-800">
              {formatINR(pricing.totalCharges)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Discount</span>
            <span className="font-medium text-brand-green">
              - {formatINR(pricing.totalDiscount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Taxes</span>
            <span className="font-medium text-slate-800">
              {formatINR(pricing.totalTaxes)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowBreakdown((v) => !v)}
          className="mt-2 text-xs font-medium text-brand-blue underline underline-offset-2"
        >
          Price Breakdown
        </button>
        {showBreakdown && (
          <p className="mt-1 text-xs text-slate-500">
            Grand Total = Total Charges &minus; Total Discount + Total Taxes
          </p>
        )}
      </div>
      <div className="flex items-center justify-between rounded-b-lg bg-brand-blue px-4 py-3 text-white">
        <span className="font-semibold">Grand Total</span>
        <span className="text-lg font-bold">
          {formatINR(pricing.grandTotal)}
        </span>
      </div>
    </section>
  );
}
