"use client";

import { X } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";

export default function BookingDetailsModal({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-trinity-900">{booking.bookingId}</h3>
            <div className="mt-1 flex items-center gap-2">
              <StatusBadge status={booking.bookingStatus} />
              <StatusBadge status={booking.paymentInfo?.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-trinity-900/50 hover:text-trinity-900"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 text-sm">
          <section>
            <h4 className="mb-2 font-semibold text-trinity-900">Stay Details</h4>
            <p className="text-trinity-900/70">
              {booking.roomSnapshot?.roomName} ({booking.roomSnapshot?.roomType}) · Meal Plan:{" "}
              {booking.mealPlan}
            </p>
            <p className="text-trinity-900/70">
              {new Date(booking.checkIn).toDateString()} → {new Date(booking.checkOut).toDateString()} ·{" "}
              {booking.nights} night{booking.nights === 1 ? "" : "s"} · {booking.roomsCount} room
              {booking.roomsCount === 1 ? "" : "s"}
            </p>
            <div className="mt-2 space-y-0.5 text-trinity-900/60">
              {booking.roomsBreakdown?.map((r, i) => (
                <p key={i}>
                  Room {r.roomNumber ?? i + 1}: {r.adults} Adult{r.adults === 1 ? "" : "s"},{" "}
                  {r.childrenBelow5} Child (Below 5), {r.children5to12} Child (5-12)
                </p>
              ))}
            </div>
          </section>

          <section>
            <h4 className="mb-2 font-semibold text-trinity-900">Guest Information</h4>
            <p className="text-trinity-900/70">
              {booking.guestInfo?.firstName} {booking.guestInfo?.lastName}
            </p>
            <p className="text-trinity-900/70">{booking.guestInfo?.email}</p>
            <p className="text-trinity-900/70">
              {booking.guestInfo?.countryCode} {booking.guestInfo?.phone}
            </p>
            {booking.guestInfo?.city && (
              <p className="text-trinity-900/70">
                {booking.guestInfo.city}, {booking.guestInfo.country}
              </p>
            )}
            {booking.guestInfo?.specialRequest && (
              <p className="mt-1 italic text-trinity-900/50">&quot;{booking.guestInfo.specialRequest}&quot;</p>
            )}
          </section>

          {booking.addOns?.length > 0 && (
            <section>
              <h4 className="mb-2 font-semibold text-trinity-900">Add-ons</h4>
              <div className="space-y-1 text-trinity-900/70">
                {booking.addOns.map((a) => (
                  <div key={a.addOnId} className="flex justify-between">
                    <span>{a.name}</span>
                    <span>₹{a.amount.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h4 className="mb-2 font-semibold text-trinity-900">Pricing</h4>
            <div className="space-y-1 text-trinity-900/70">
              <div className="flex justify-between">
                <span>Room Charges</span>
                <span>₹{booking.pricingBreakdown?.roomCharges.toLocaleString("en-IN")}</span>
              </div>
              {booking.pricingBreakdown?.addOnCharges > 0 && (
                <div className="flex justify-between">
                  <span>Add-on Charges</span>
                  <span>₹{booking.pricingBreakdown.addOnCharges.toLocaleString("en-IN")}</span>
                </div>
              )}
              {booking.pricingBreakdown?.totalDiscount > 0 && (
                <div className="flex justify-between text-trinity-600">
                  <span>Discount {booking.promoApplied?.code ? `(${booking.promoApplied.code})` : ""}</span>
                  <span>- ₹{booking.pricingBreakdown.totalDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes ({booking.pricingBreakdown?.taxPercent}%)</span>
                <span>₹{booking.pricingBreakdown?.totalTaxes.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-trinity-700 px-4 py-3 text-white">
              <span className="font-semibold">Grand Total</span>
              <span className="text-lg font-bold">
                ₹{booking.pricingBreakdown?.grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </section>

          <section>
            <h4 className="mb-2 font-semibold text-trinity-900">Payment</h4>
            <div className="space-y-0.5 text-trinity-900/70">
              <p>Amount Paid: ₹{(booking.paymentInfo?.amountPaid ?? 0).toLocaleString("en-IN")}</p>
              {booking.paymentInfo?.paymentId && <p>Payment ID: {booking.paymentInfo.paymentId}</p>}
              {booking.paymentInfo?.paidAt && <p>Paid At: {new Date(booking.paymentInfo.paidAt).toLocaleString()}</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
