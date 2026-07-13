"use client";

import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "@/store/slices/bookingSlice";

const NAV_ITEMS = [
  { id: "property-info", label: "Property Info" },
  { id: "photo-gallery", label: "Photo Gallery" },
  { id: "facilities", label: "Facilities" },
  { id: "location", label: "Location" },
];

export default function Header({ hotel }) {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.booking.activeTab);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {hotel.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{hotel.tagline}</p>
        </div>
        <nav
          aria-label="Property sections"
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-600"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => dispatch(setActiveTab(item.id))}
              className={`transition-colors hover:text-brand-blue ${
                activeTab === item.id ? "text-brand-blue" : ""
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
