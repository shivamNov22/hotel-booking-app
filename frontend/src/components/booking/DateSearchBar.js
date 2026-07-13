"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchDates } from "@/store/slices/bookingSlice";
import Button from "@/components/ui/Button";

export default function DateSearchBar() {
  const dispatch = useDispatch();
  const search = useSelector((state) => state.booking.search);
  const [checkIn, setCheckIn] = useState(search.checkIn);
  const [checkOut, setCheckOut] = useState(search.checkOut);

  function handleCheck() {
    dispatch(setSearchDates({ checkIn, checkOut }));
  }

  return (
    <div className="bg-brand-navy">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex-1">
            <span className="sr-only">Check-in date</span>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full rounded-md border border-transparent bg-white px-3 py-2.5 text-sm text-slate-800"
            />
          </label>
          <label className="flex-1">
            <span className="sr-only">Check-out date</span>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full rounded-md border border-transparent bg-white px-3 py-2.5 text-sm text-slate-800"
            />
          </label>
          <div className="rounded-md bg-white/10 px-3 py-2.5 text-sm font-medium text-white sm:w-28 sm:text-center">
            {search.nights} night{search.nights > 1 ? "s" : ""}
          </div>
          <Button
            variant="primary"
            onClick={handleCheck}
            className="w-full sm:w-auto"
          >
            Check Availability
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <button
            type="button"
            className="rounded-md bg-white/10 px-4 py-2.5 font-medium text-white transition-colors hover:bg-white/20"
          >
            Manage My Booking
          </button>
          <select
            aria-label="Select language"
            className="rounded-md border-none bg-white/10 px-3 py-2.5 font-medium text-white"
            defaultValue="en"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      </div>
    </div>
  );
}
