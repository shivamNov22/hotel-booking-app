"use client";

import { Search } from "lucide-react";

const ROOM_TYPES = ["Executive Suite", "Deluxe", "Single"];
const STATUS_OPTIONS = ["Available", "Occupied", "Maintenance"];
const SORT_OPTIONS = [
  { value: "roomId_asc", label: "Room ID (Asc)" },
  { value: "roomId_desc", label: "Room ID (Desc)" },
  { value: "price_asc", label: "Price (Low-High)" },
  { value: "price_desc", label: "Price (High-Low)" },
];

export default function FiltersBar({ filters, onChange }) {
  const update = (field) => (e) => onChange({ ...filters, [field]: e.target.value, page: 1 });

  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-trinity-900/70">Search Rooms:</label>
        <div className="relative">
          <input
            value={filters.search}
            onChange={update("search")}
            placeholder="Search by name or Room ID"
            className="w-full rounded-lg border border-black/10 px-3 py-2 pr-9 text-sm focus:border-trinity-500 focus:outline-none"
          />
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-trinity-900/40" />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-trinity-900/70">Filter by Type</label>
        <select
          value={filters.roomType}
          onChange={update("roomType")}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
        >
          <option value="">All Types</option>
          {ROOM_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-trinity-900/70">Filter by Availability</label>
        <select
          value={filters.availabilityStatus}
          onChange={update("availabilityStatus")}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-trinity-900/70">Sort by</label>
        <select
          value={filters.sortBy}
          onChange={update("sortBy")}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
