"use client";

import { useState } from "react";
import { useValidatePromoMutation } from "@/redux/api/promoApi";

export default function PromoCodeBox({ bookingAmount, onApplied, onCleared }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }
  const [validatePromo, { isLoading }] = useValidatePromoMutation();

  const handleApply = async () => {
    if (!code.trim()) return;
    setMessage(null);
    try {
      const res = await validatePromo({ promoCode: code.trim(), bookingAmount }).unwrap();
      setMessage({ type: "success", text: res.message });
      onApplied({
        code: code.trim().toUpperCase(),
        discountAmount: res.discount.amount,
        discountType: res.discount.type,
      });
    } catch (err) {
      setMessage({ type: "error", text: err?.data?.message || "Invalid promo code." });
      onCleared();
    }
  };

  const handleClear = () => {
    setCode("");
    setMessage(null);
    onCleared();
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <h2 className="bg-trinity-700 px-5 py-3 text-sm font-semibold text-white">Promo Code</h2>
      <div className="flex gap-2 p-5">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Promo Code"
          className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
        />
        {message ? (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg bg-cream px-4 py-2 text-sm font-medium text-trinity-900/70 hover:bg-black/5"
          >
            Clear
          </button>
        ) : (
          <button
            type="button"
            onClick={handleApply}
            disabled={isLoading || !code.trim()}
            className="rounded-lg bg-trinity-500 px-4 py-2 text-sm font-medium text-white hover:bg-trinity-600 disabled:opacity-60"
          >
            {isLoading ? "Checking..." : "Apply"}
          </button>
        )}
      </div>
      {message && (
        <p
          className={`px-5 pb-4 text-sm ${
            message.type === "success" ? "text-trinity-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
