"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import AdminLoginModal from "@/components/shared/AdminLoginModal";

const NAV_TABS = [
  "Rooms",
  "Offers",
  "Location",
  "Cafe",
  "Conference Hall",
  "Gallery",
  "Facilities",
  "Terms & Conditions",
  "Contact Us",
];

export default function Header() {
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const scrollToRooms = () => {
    document.getElementById("rooms-collection")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-trinity-100 text-lg font-bold text-trinity-700">
              T
            </div>
            <div className="leading-tight">
              <p className="text-lg font-semibold text-trinity-900">Trinity Suites</p>
              <p className="text-xs text-trinity-900/50">Boutique Serviced Suites, Bangalore</p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_TABS.map((tab) => {
              // Every tab except "Rooms" is still UI-only for now — no
              // routing/functionality yet, per the current build phase.
              if (tab !== "Rooms") {
                return (
                  <button
                    key={tab}
                    type="button"
                    className="text-sm text-trinity-900/60 transition-colors hover:text-trinity-700"
                  >
                    {tab}
                  </button>
                );
              }

              // "Rooms" is only ever "active" while actually on the homepage
              // (where the Rooms grid lives). On any other page — e.g. the
              // Manage My Booking flow — it must not appear pre-selected,
              // and clicking it should take the guest to the Rooms page
              // instead of doing nothing.
              return isHomePage ? (
                <button
                  key={tab}
                  type="button"
                  onClick={scrollToRooms}
                  className="border-b-2 border-trinity-500 pb-1 text-sm font-medium text-trinity-700 transition-colors"
                >
                  Rooms
                </button>
              ) : (
                <Link
                  key={tab}
                  href="/#rooms-collection"
                  className="text-sm text-trinity-900/60 transition-colors hover:text-trinity-700"
                >
                  Rooms
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setAdminLoginOpen(true)}
              className="flex items-center gap-1.5 text-sm text-trinity-900/60 hover:text-trinity-700"
            >
              <ShieldCheck size={16} />
              Admin Login
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/my-bookings"
              className="whitespace-nowrap rounded-lg border border-trinity-500/30 px-4 py-2.5 text-sm font-medium text-trinity-700 hover:bg-trinity-100"
            >
              Manage My Booking
            </Link>
            {isHomePage ? (
              <button
                type="button"
                onClick={scrollToRooms}
                className="whitespace-nowrap rounded-lg bg-trinity-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-trinity-600"
              >
                Book Now
              </button>
            ) : (
              <Link
                href="/#rooms-collection"
                className="whitespace-nowrap rounded-lg bg-trinity-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-trinity-600"
              >
                Book Now
              </Link>
            )}
          </div>
        </div>
      </header>

      <AdminLoginModal open={adminLoginOpen} onClose={() => setAdminLoginOpen(false)} />
    </>
  );
}
