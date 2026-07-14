export default function BookingSummaryDetails({ booking }) {
  if (!booking) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-trinity-900">Stay Details</h2>
          <div className="flex justify-between text-sm text-trinity-900/70">
            <span>Check-in: {new Date(booking.stayDetails.checkIn).toDateString()}</span>
            <span>Check-out: {new Date(booking.stayDetails.checkOut).toDateString()}</span>
          </div>
          <p className="mt-1 text-sm text-trinity-900/70">
            {booking.stayDetails.nights} night{booking.stayDetails.nights === 1 ? "" : "s"} ·{" "}
            {booking.stayDetails.roomsCount} room{booking.stayDetails.roomsCount === 1 ? "" : "s"}
          </p>
          <div className="mt-3 border-t border-black/5 pt-3">
            <p className="font-medium text-trinity-900">{booking.room.roomName}</p>
            <p className="text-sm text-trinity-900/50">
              {booking.room.roomType} · Meal Plan: {booking.room.mealPlan}
            </p>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-trinity-900">Rooms Breakdown</h2>
          <div className="space-y-1 text-sm text-trinity-900/70">
            {booking.roomsBreakdown.map((r, i) => (
              <p key={i}>
                Room {i + 1}: {r.adults} Adult{r.adults === 1 ? "" : "s"}, {r.childrenBelow5} Child (Below 5),{" "}
                {r.children5to12} Child (5-12)
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-trinity-900">Guest Information</h2>
          <p className="text-sm text-trinity-900/70">
            {booking.guestInfo.firstName} {booking.guestInfo.lastName}
          </p>
          <p className="text-sm text-trinity-900/70">{booking.guestInfo.email}</p>
          <p className="text-sm text-trinity-900/70">
            {booking.guestInfo.countryCode} {booking.guestInfo.phone}
          </p>
          {booking.guestInfo.city && (
            <p className="text-sm text-trinity-900/70">
              {booking.guestInfo.city}, {booking.guestInfo.country}
            </p>
          )}
          {booking.guestInfo.specialRequest && (
            <p className="mt-2 text-sm italic text-trinity-900/50">
              &quot;{booking.guestInfo.specialRequest}&quot;
            </p>
          )}
        </section>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-trinity-900">Invoice Summary</h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-trinity-900/70">
              <span>Room Charges</span>
              <span>₹{booking.pricingBreakdown.roomCharges.toLocaleString("en-IN")}</span>
            </div>
            {booking.addOns?.length > 0 && (
              <div className="flex justify-between text-trinity-900/70">
                <span>Add-on Charges</span>
                <span>₹{booking.pricingBreakdown.addOnCharges.toLocaleString("en-IN")}</span>
              </div>
            )}
            {booking.pricingBreakdown.totalDiscount > 0 && (
              <div className="flex justify-between text-trinity-600">
                <span>Discount {booking.promoApplied?.code ? `(${booking.promoApplied.code})` : ""}</span>
                <span>- ₹{booking.pricingBreakdown.totalDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-trinity-900/70">
              <span>Taxes ({booking.pricingBreakdown.taxPercent}%)</span>
              <span>₹{booking.pricingBreakdown.totalTaxes.toLocaleString("en-IN")}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg bg-trinity-700 px-4 py-3 text-white">
            <span className="font-semibold">Grand Total</span>
            <span className="text-lg font-bold">
              ₹{booking.pricingBreakdown.grandTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-trinity-900">Payment Information</h2>
          <div className="space-y-1 text-sm text-trinity-900/70">
            <p>Status: {booking.paymentInfo.status}</p>
            <p>Amount Paid: ₹{booking.paymentInfo.amountPaid.toLocaleString("en-IN")}</p>
            {booking.paymentInfo.paymentId && <p>Payment ID: {booking.paymentInfo.paymentId}</p>}
            {booking.paymentInfo.paidAt && <p>Paid At: {new Date(booking.paymentInfo.paidAt).toLocaleString()}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
