"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Search } from "lucide-react";
import Header from "@/components/user/Header";
import BookingLookupForm from "@/components/user/BookingLookupForm";
import BookingSummaryDetails from "@/components/user/BookingSummaryDetails";

// Manage My Booking is a dedicated journey, separate from the normal
// homepage → Rooms flow:
//   Booking Lookup (this page, default view)
//     -> Booking Details (after a successful lookup)
//     -> Rooms page (only if the guest chooses to keep browsing, via "/")
export default function MyBookingsPage() {
  const [booking, setBooking] = useState(null);

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {!booking && <BookingLookupForm onFound={setBooking} />}

      {booking && (
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-trinity-100 text-trinity-600">
                <CalendarCheck size={22} />
              </span>
              <div>
                <h1 className="text-xl font-semibold text-trinity-900">
                  Booking {booking.bookingId}
                </h1>
                <p className="text-sm text-trinity-900/50">Status: {booking.bookingStatus}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setBooking(null)}
              className="flex items-center gap-1.5 text-sm text-trinity-900/60 hover:text-trinity-700"
            >
              <Search size={14} />
              Look up another booking
            </button>
          </div>

          <BookingSummaryDetails booking={booking} />

          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="rounded-lg bg-trinity-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-trinity-600"
            >
              Continue Browsing Rooms
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
