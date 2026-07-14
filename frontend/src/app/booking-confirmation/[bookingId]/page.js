"use client";

import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Printer } from "lucide-react";
import Skeleton from "@/components/shared/Skeleton";
import BookingSummaryDetails from "@/components/user/BookingSummaryDetails";
import { useGetBookingConfirmationQuery } from "@/redux/api/bookingApi";

export default function BookingConfirmationPage() {
  const { bookingId } = useParams();
  const router = useRouter();

  const { data, isLoading, isError, error } = useGetBookingConfirmationQuery(bookingId);
  const booking = data?.booking;

  return (
    <div className="min-h-screen bg-cream px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {isError && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-red-600">
              {error?.data?.message || "Couldn't find this booking."}
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-4 rounded-lg bg-trinity-500 px-5 py-2 text-sm font-medium text-white hover:bg-trinity-600"
            >
              Back to Rooms
            </button>
          </div>
        )}

        {booking && (
          <>
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-trinity-100 text-trinity-600">
                <CheckCircle2 size={22} />
              </span>
              <div>
                <h1 className="text-xl font-semibold text-trinity-900">
                  Booking Confirmation: {booking.bookingId}
                </h1>
                <p className="text-sm text-trinity-900/50">Status: {booking.bookingStatus}</p>
              </div>
            </div>

            <BookingSummaryDetails booking={booking} />

            <button
              type="button"
              onClick={() => window.print()}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-medium text-trinity-900 shadow-sm hover:bg-cream lg:w-auto lg:px-6"
            >
              <Printer size={16} /> Print Confirmation
            </button>
          </>
        )}
      </div>
    </div>
  );
}
