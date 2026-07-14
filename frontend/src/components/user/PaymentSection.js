import { ShieldCheck } from "lucide-react";

export default function PaymentSection({
  termsAccepted,
  onTermsChange,
  onSubmit,
  isSubmitting,
  submitError,
  submitStage,
}) {
  const STAGE_LABELS = {
    booking: "Creating your booking...",
    order: "Setting up payment...",
    verifying: "Confirming payment...",
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <h2 className="bg-trinity-700 px-5 py-3 text-sm font-semibold text-white">Make Payment</h2>
      <div className="space-y-4 p-5">
        <label className="flex items-center gap-3 rounded-xl border border-trinity-500 bg-trinity-100/30 px-4 py-3">
          <input type="radio" checked readOnly className="h-4 w-4 accent-trinity-500" />
          <span className="flex flex-1 items-center gap-2 text-sm font-medium text-trinity-900">
            <ShieldCheck size={16} className="text-trinity-600" />
            Secure Payment Gateway (Test Mode)
          </span>
        </label>
        <p className="text-xs text-trinity-900/40">
          This is a dummy payment flow for now — no real charge is made. Card/UPI/NetBanking will be wired to a
          real gateway later.
        </p>

        <label className="flex items-start gap-2 text-sm text-trinity-900/70">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="mt-1 h-4 w-4 accent-trinity-500"
          />
          I have read and accept the Reservation &amp; Cancellation Policy.
        </label>

        {submitError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={!termsAccepted || isSubmitting}
          className="w-full rounded-lg bg-trinity-500 py-3 text-sm font-semibold text-white hover:bg-trinity-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
        >
          {isSubmitting ? STAGE_LABELS[submitStage] || "Processing..." : "Make Payment"}
        </button>
      </div>
    </div>
  );
}
