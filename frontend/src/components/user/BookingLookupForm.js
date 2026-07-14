"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useLazyLookupBookingQuery } from "@/redux/api/bookingApi";

export default function BookingLookupForm({ onFound }) {
  const [bookingId, setBookingId] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");

  const [triggerLookup, { isFetching }] = useLazyLookupBookingQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!bookingId.trim() || !email.trim()) {
      setFormError("Please enter both your Booking Reference Number and Email.");
      return;
    }

    try {
      const result = await triggerLookup({ bookingId: bookingId.trim(), email: email.trim() }).unwrap();
      onFound(result?.booking);
    } catch (err) {
      setFormError(
        err?.data?.message || "We couldn't find a booking matching those details. Please check and try again."
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-semibold text-trinity-900">My Bookings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[220px_1fr_auto]">
          <label htmlFor="bookingId" className="text-sm text-trinity-900/70">
            Booking Ref. Number:
          </label>
          <input
            id="bookingId"
            type="text"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
          />
          <span className="text-xs text-trinity-900/40 sm:pl-2">(For Example : CODE-10164750513)</span>
        </div>

        <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[220px_1fr_auto]">
          <label htmlFor="email" className="text-sm text-trinity-900/70">
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
          />
        </div>

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={isFetching}
          className="flex items-center justify-center gap-2 rounded-lg bg-trinity-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-trinity-600 disabled:opacity-70"
        >
          {isFetching && <Loader2 size={16} className="animate-spin" />}
          {isFetching ? "Looking up..." : "View Booking"}
        </button>
      </form>
    </div>
  );
}
