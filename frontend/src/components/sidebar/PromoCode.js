"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  setPromoCode,
  promoRequestStarted,
  promoRequestSucceeded,
  promoRequestFailed,
  clearPromo,
} from "@/store/slices/bookingSlice";
import { useApplyPromoCodeMutation } from "@/store/api/bookingApi";
import Button from "@/components/ui/Button";

export default function PromoCode({ subtotal }) {
  const dispatch = useDispatch();
  const promo = useSelector((state) => state.booking.promo);
  const [applyPromoCode, { isLoading }] = useApplyPromoCodeMutation();

  async function handleApply() {
    if (!promo.code.trim()) return;
    dispatch(promoRequestStarted());
    try {
      const result = await applyPromoCode({
        code: promo.code,
        subtotal,
      }).unwrap();
      dispatch(
        promoRequestSucceeded({
          discountAmount: result.discountAmount,
          message: result.message,
        })
      );
    } catch (err) {
      dispatch(
        promoRequestFailed(err?.data?.message || "Unable to apply promo code.")
      );
    }
  }

  return (
    <section
      aria-labelledby="promo-heading"
      className="rounded-lg border border-slate-200 bg-white shadow-card"
    >
      <h2
        id="promo-heading"
        className="rounded-t-lg bg-brand-blue px-4 py-3 text-base font-semibold text-white"
      >
        Promo Code
      </h2>
      <div className="p-4">
        <div className="flex gap-2">
          <input
            value={promo.code}
            onChange={(e) => {
              dispatch(setPromoCode(e.target.value));
              if (promo.applied) dispatch(clearPromo());
            }}
            placeholder="Promo Code"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
          />
          <Button variant="secondary" onClick={handleApply} disabled={isLoading}>
            {isLoading ? "..." : "Apply →"}
          </Button>
        </div>
        {promo.message && (
          <p
            className={`mt-2 text-xs ${
              promo.status === "success" ? "text-brand-green" : "text-red-600"
            }`}
          >
            {promo.message}
          </p>
        )}
      </div>
    </section>
  );
}
