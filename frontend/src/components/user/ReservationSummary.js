import { Zap, ShieldCheck, BadgePercent } from "lucide-react";

const TRUST_BADGES = [
  {
    icon: Zap,
    title: "Instant Reservation Confirmation",
    text: "Secure your stay with immediate booking confirmation.",
  },
  {
    icon: ShieldCheck,
    title: "Book Direct & Save More",
    text: "You're booking straight from the property's own booking engine.",
  },
  {
    icon: BadgePercent,
    title: "Lowest Rates",
    text: "Enjoy special rates and hassle-free refunds.",
  },
];

export default function ReservationSummary({ checkIn, checkOut, nights, pricing }) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <h2 className="bg-trinity-700 px-5 py-3 text-sm font-semibold text-white">Reservation Summary</h2>
        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-trinity-900/50">Check In</p>
              <p className="font-medium text-trinity-900">{checkIn}</p>
            </div>
            <span className="rounded-full bg-trinity-500 px-3 py-1 text-xs text-white">
              {nights} night{nights === 1 ? "" : "s"}
            </span>
            <div className="text-right">
              <p className="text-xs text-trinity-900/50">Check Out</p>
              <p className="font-medium text-trinity-900">{checkOut}</p>
            </div>
          </div>

          <div className="space-y-2 border-t border-black/5 pt-4 text-sm">
            <div className="flex justify-between text-trinity-900/70">
              <span>Total Charges</span>
              <span>₹{pricing.roomCharges.toLocaleString("en-IN")}</span>
            </div>
            {pricing.totalDiscount > 0 && (
              <div className="flex justify-between text-trinity-600">
                <span>Total Discount</span>
                <span>- ₹{pricing.totalDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-trinity-900/70">
              <span>Total Taxes ({pricing.taxPercent}%)</span>
              <span>₹{pricing.totalTaxes.toLocaleString("en-IN")}</span>
            </div>
            {pricing.addOnCharges > 0 && (
              <div className="flex justify-between text-trinity-900/70">
                <span>Add-on Charges</span>
                <span>₹{pricing.addOnCharges.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg bg-trinity-700 px-4 py-3 text-white">
            <span className="font-semibold">Grand Total</span>
            <span className="text-lg font-bold">₹{pricing.grandTotal.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-center text-[11px] text-trinity-900/40">
            Estimated total — the confirmed amount is calculated by the server when you submit your booking.
          </p>
        </div>
      </div>

      {TRUST_BADGES.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-trinity-100 text-trinity-600">
            <Icon size={18} />
          </span>
          <div>
            <p className="text-sm font-medium text-trinity-900">{title}</p>
            <p className="text-xs text-trinity-900/50">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
