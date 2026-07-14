"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import AdminLoginModal from "@/components/shared/AdminLoginModal";

const TABS = ["Property Info", "Photo Gallery", "Facilities", "Location"];

function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const oneDay = 1000 * 60 * 60 * 24;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, Math.round(diff / oneDay));
}

export default function BookingHeader({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  onCheckAvailability,
  activeTab,
  onTabChange,
}) {
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const nights = nightsBetween(checkIn, checkOut);

  return (
    <>
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-trinity-900">
              Trinity Suites Bangalore
            </h1>
            <p className="text-sm text-trinity-900/50">
              Boutique Serviced Suites 1/3, Bangalore, Karnataka, India
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-5">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`text-sm transition-colors ${
                  activeTab === tab
                    ? "rounded-md bg-trinity-500 px-3 py-1.5 font-medium text-white"
                    : "text-trinity-900/60 hover:text-trinity-700"
                }`}
              >
                {tab}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAdminLoginOpen(true)}
              className="flex items-center gap-1.5 text-sm text-trinity-900/60 hover:text-trinity-700"
            >
              <ShieldCheck size={16} />
              Admin Login
            </button>
          </nav>
        </div>
      </header>

      <div className="bg-trinity-700">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-4">
          <label className="flex flex-col text-xs text-white/70">
            Check-in
            <input
              type="date"
              value={checkIn}
              onChange={(e) => onCheckInChange(e.target.value)}
              className="mt-1 rounded-lg border-0 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-trinity-400"
            />
          </label>
          <label className="flex flex-col text-xs text-white/70">
            Check-out
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => onCheckOutChange(e.target.value)}
              className="mt-1 rounded-lg border-0 px-3 py-2 text-sm  focus:outline-none focus:ring-2 focus:ring-trinity-400"
            />
          </label>
          <span className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-sm text-white">
            {nights} night{nights === 1 ? "" : "s"}
          </span>
          <button
            type="button"
            onClick={onCheckAvailability}
            className="mt-4 rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Check Availability
          </button>

          <div className="ml-auto mt-4 flex items-center gap-3">
            <Link
              href="/my-bookings"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
            >
              Manage My Booking
            </Link>
            <select
              disabled
              title="Not built yet"
              className="cursor-not-allowed rounded-lg bg-white/10 px-3 py-2 text-sm text-white/70"
            >
              <option>Select Language</option>
            </select>
          </div>
        </div>
      </div>

      <AdminLoginModal
        open={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
      />
    </>
  );
}
