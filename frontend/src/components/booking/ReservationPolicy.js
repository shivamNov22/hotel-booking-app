export default function ReservationPolicy({ policy }) {
  return (
    <section
      aria-labelledby="policy-heading"
      className="rounded-lg border border-slate-200 bg-white shadow-card"
    >
      <h2
        id="policy-heading"
        className="rounded-t-lg bg-brand-blue px-4 py-3 text-base font-semibold text-white sm:px-6"
      >
        Reservation Policy and Terms &amp; Conditions
      </h2>
      <div className="space-y-3 p-4 text-sm leading-relaxed text-slate-600 sm:p-6">
        <p>
          Check-in time is {policy.checkIn}, Check-out time is{" "}
          {policy.checkOut}.
        </p>
        {policy.terms.map((term, i) => (
          <p key={i}>{term}</p>
        ))}
      </div>
    </section>
  );
}
