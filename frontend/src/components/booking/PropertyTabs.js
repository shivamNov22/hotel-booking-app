"use client";

import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "@/store/slices/bookingSlice";

const TABS = [
  { id: "property-info", label: "Property Info" },
  { id: "photo-gallery", label: "Photo Gallery" },
  { id: "facilities", label: "Facilities" },
  { id: "location", label: "Location" },
];

export default function PropertyTabs({ hotel }) {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.booking.activeTab);

  return (
    <section
      id="property-info"
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-card"
    >
      <div
        role="tablist"
        aria-label="Property details"
        className="flex flex-wrap border-b border-slate-200 bg-brand-blue text-sm font-semibold text-white"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => dispatch(setActiveTab(tab.id))}
            className={`px-5 py-3 transition-colors ${
              activeTab === tab.id
                ? "bg-white text-brand-blue"
                : "hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6">
        {activeTab === "property-info" && (
          <div className="space-y-4 text-sm leading-relaxed text-slate-600">
            {hotel.propertyInfo.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}

        {activeTab === "photo-gallery" && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {hotel.images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`${hotel.name} photo ${i + 1}`}
                loading="lazy"
                className="h-32 w-full rounded-md object-cover sm:h-36"
              />
            ))}
          </div>
        )}

        {activeTab === "facilities" && (
          <ul className="grid grid-cols-2 gap-3 text-sm text-slate-600 sm:grid-cols-3">
            {hotel.facilities.map((facility) => (
              <li key={facility} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
                {facility}
              </li>
            ))}
          </ul>
        )}

        {activeTab === "location" && (
          <div>
            <p className="mb-3 text-sm text-slate-600">
              {hotel.location.address}
            </p>
            <iframe
              title="Hotel location map"
              className="h-64 w-full rounded-md border border-slate-200"
              src={`https://maps.google.com/maps?q=${hotel.location.lat},${hotel.location.lng}&z=15&output=embed`}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>
  );
}
