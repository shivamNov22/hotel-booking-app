export default function ReservationPolicy() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <h2 className="bg-trinity-700 px-5 py-3 text-sm font-semibold text-white">
        Reservation Policy and Terms &amp; Conditions
      </h2>
      {/* Static placeholder — there's no backend field for property policy yet.
          Add a `policyText` field to a future Property/Settings model if you
          want this to be admin-editable instead of hardcoded here. */}
      <div className="space-y-3 p-5 text-sm text-trinity-900/70">
        <p>Early check-in or late check-out is subject to availability and may carry an additional charge.</p>
        <p>Standard check-in time is 12:00 PM and check-out time is 12:00 PM.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Cancellations within 24 hours of check-in, or no-shows, are charged the full stay amount.</li>
          <li>Cancellations between 24–48 hours of check-in incur a one-night charge.</li>
          <li>Amendments follow the same policy and must be requested at least 48 hours before check-in.</li>
          <li>
            A valid government-issued photo ID (passport, voter ID, driving licence, or PAN card) is required at
            check-in for all guests, per local regulations.
          </li>
          <li>Refunds, where applicable, are processed within 5–7 working days to the original payment method.</li>
        </ul>
      </div>
    </div>
  );
}
