"use client";

import { useSelector, useDispatch } from "react-redux";
import { toggleAddOn } from "@/store/slices/bookingSlice";
import { formatINR } from "@/utils/formatCurrency";
import Checkbox from "@/components/ui/Checkbox";

export default function AddOns({ addOns }) {
  const dispatch = useDispatch();
  const addOnsState = useSelector((state) => state.booking.addOns);

  return (
    <section
      aria-labelledby="add-to-stay-heading"
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-card sm:p-6"
    >
      <h2
        id="add-to-stay-heading"
        className="mb-4 text-lg font-semibold text-slate-900"
      >
        Add to your stay
      </h2>
      <div className="space-y-3">
        {addOns.map((addOn) => {
          const checked = addOnsState[addOn.id]?.checked || false;
          return (
            <div
              key={addOn.id}
              className="flex flex-col gap-2 rounded-md border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={checked}
                  onChange={(e) =>
                    dispatch(
                      toggleAddOn({
                        addOnId: addOn.id,
                        checked: e.target.checked,
                      })
                    )
                  }
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {addOn.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {addOn.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 pl-7 text-sm sm:pl-0">
                <span className="text-slate-500">
                  {addOn.unit === "trip"
                    ? formatINR(addOn.price)
                    : `INR ${addOn.price} Per Adult, ${addOn.childPrice} Per Child`}
                </span>
                <span className="font-semibold text-slate-800">
                  {checked
                    ? formatINR(
                        addOn.unit === "trip" ? addOn.price : addOn.price
                      )
                    : formatINR(0)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
