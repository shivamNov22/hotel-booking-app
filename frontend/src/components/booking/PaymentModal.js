"use client";

import { formatINR } from "@/utils/formatCurrency";
import Button from "@/components/ui/Button";

export default function PaymentModal({ amount, onClose, onConfirm, isLoading }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-heading"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-brand-navy px-5 py-4 text-white">
          <h2 id="payment-modal-heading" className="text-sm font-semibold">
            Payment Options
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment options"
            className="text-white/80 hover:text-white"
          >
            &#10005;
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between rounded-md bg-slate-50 px-4 py-3">
            <span className="text-xs uppercase tracking-wide text-slate-500">
              Amount payable
            </span>
            <span className="text-lg font-bold text-slate-900">
              {formatINR(amount)}
            </span>
          </div>
          <p className="text-sm text-slate-600">
            You will be redirected to the secure Razorpay checkout to
            complete payment via UPI, Cards, Netbanking or Wallet.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center text-xs font-medium text-slate-600">
            <div className="rounded-md border border-slate-200 py-3">UPI</div>
            <div className="rounded-md border border-slate-200 py-3">
              Cards
            </div>
            <div className="rounded-md border border-slate-200 py-3">
              Netbanking
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="confirm" onClick={onConfirm} disabled={isLoading}>
              {isLoading ? "Confirming..." : "Pay Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
