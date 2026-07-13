"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  setPaymentMethod,
  setPolicyAccepted,
} from "@/store/slices/bookingSlice";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";

export default function PaymentSection({ onMakePayment, canPay, isLoading }) {
  const dispatch = useDispatch();
  const paymentMethod = useSelector((state) => state.booking.paymentMethod);
  const policyAccepted = useSelector(
    (state) => state.booking.policyAccepted
  );

  return (
    <section
      aria-labelledby="payment-heading"
      id="make-payment"
      className="rounded-lg border border-slate-200 bg-white shadow-card"
    >
      <h2
        id="payment-heading"
        className="rounded-t-lg bg-brand-blue px-4 py-3 text-base font-semibold text-white sm:px-6"
      >
        Make Payment
      </h2>
      <div className="p-4 sm:p-6">
        <label className="flex flex-col gap-2 rounded-md border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-3">
            <input
              type="radio"
              name="payment-method"
              checked={paymentMethod === "razorpay"}
              onChange={() => dispatch(setPaymentMethod("razorpay"))}
              className="h-4 w-4 text-brand-blue focus:ring-brand-blue"
            />
            <span className="text-sm font-medium text-slate-700">
              RazorPay OAuth Payment Gateway
            </span>
          </span>
          <span className="text-xs font-semibold text-slate-400">
            Visa &middot; Mastercard &middot; RuPay &middot; UPI &middot; Net
            Banking
          </span>
        </label>

        <div className="mt-4">
          <Checkbox
            label="I have read and accept the Reservation & Cancellation Policy."
            checked={policyAccepted}
            onChange={(e) => dispatch(setPolicyAccepted(e.target.checked))}
          />
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            variant="confirm"
            disabled={!canPay || isLoading}
            onClick={onMakePayment}
          >
            {isLoading ? "Processing..." : "Make Payment"}
          </Button>
        </div>
      </div>
    </section>
  );
}
