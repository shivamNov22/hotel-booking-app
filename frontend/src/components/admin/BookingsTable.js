"use client";

import StatusBadge from "@/components/shared/StatusBadge";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function BookingsTable({ bookings, isLoading }) {
  if (isLoading) {
    return <p className="px-6 py-10 text-center text-sm text-trinity-900/50">Loading bookings...</p>;
  }

  if (!bookings || bookings.length === 0) {
    return <p className="px-6 py-10 text-center text-sm text-trinity-900/50">No bookings found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] text-left text-sm">
        <thead>
          <tr className="border-b border-black/5 text-trinity-900/60">
            <th className="whitespace-nowrap px-6 py-3 font-medium">Booking ID</th>
            <th className="whitespace-nowrap px-6 py-3 font-medium">Customer Name</th>
            <th className="whitespace-nowrap px-6 py-3 font-medium">Customer Email</th>
            <th className="whitespace-nowrap px-6 py-3 font-medium">Customer Phone</th>
            <th className="whitespace-nowrap px-6 py-3 font-medium">Room</th>
            <th className="whitespace-nowrap px-6 py-3 font-medium">Rooms</th>
            <th className="whitespace-nowrap px-6 py-3 font-medium">Check-in</th>
            <th className="whitespace-nowrap px-6 py-3 font-medium">Check-out</th>
            <th className="whitespace-nowrap px-6 py-3 font-medium">Total Price</th>
            <th className="whitespace-nowrap px-6 py-3 font-medium">Booking Status</th>
            <th className="whitespace-nowrap px-6 py-3 font-medium">Payment Status</th>
            <th className="whitespace-nowrap px-6 py-3 font-medium">Booking Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.bookingId || booking._id} className="border-b border-black/5 last:border-0">
              <td className="whitespace-nowrap px-6 py-4 font-medium text-trinity-900">
                {booking.bookingId}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-trinity-900">
                {booking.guestInfo?.firstName} {booking.guestInfo?.lastName}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-trinity-900/70">
                {booking.guestInfo?.email || "—"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-trinity-900/70">
                {booking.guestInfo?.countryCode} {booking.guestInfo?.phone}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-trinity-900">
                <p>{booking.roomSnapshot?.roomName || booking.roomId}</p>
                {booking.roomSnapshot?.roomType && (
                  <p className="text-xs text-trinity-900/50">{booking.roomSnapshot.roomType}</p>
                )}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-trinity-900/70">{booking.roomsCount}</td>
              <td className="whitespace-nowrap px-6 py-4 text-trinity-900/70">{formatDate(booking.checkIn)}</td>
              <td className="whitespace-nowrap px-6 py-4 text-trinity-900/70">{formatDate(booking.checkOut)}</td>
              <td className="whitespace-nowrap px-6 py-4 font-medium text-trinity-900">
                ₹{(booking.pricingBreakdown?.grandTotal ?? 0).toLocaleString("en-IN")}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <StatusBadge status={booking.bookingStatus} />
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <StatusBadge status={booking.paymentInfo?.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-trinity-900/70">
                {formatDate(booking.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
