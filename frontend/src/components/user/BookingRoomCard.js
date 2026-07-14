"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff, ChevronDown } from "lucide-react";
import { getAmenityIcon } from "@/lib/amenityIcons";

export default function BookingRoomCard({ room, pricePerNight }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="flex flex-col gap-5 p-5 sm:flex-row">
        <div className="relative h-40 w-full flex-shrink-0 overflow-hidden rounded-xl bg-cream sm:w-56">
          {room.image ? (
            <Image src={room.image} alt={room.roomName} fill sizes="224px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-trinity-900/30">
              <ImageOff size={24} />
              <span className="text-xs">Image not available</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-semibold text-trinity-900">{room.roomName}</h2>
              <div className="text-right">
                <p className="text-2xl font-bold text-trinity-900">₹{pricePerNight.toLocaleString("en-IN")}</p>
                <p className="text-xs text-trinity-900/50">Per Night</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowMore((s) => !s)}
              className="mt-1 flex items-center gap-1 text-sm text-trinity-600 hover:underline"
            >
              See More
              <ChevronDown size={14} className={`transition-transform ${showMore ? "rotate-180" : ""}`} />
            </button>

            {showMore && (
              <p className="mt-2 text-sm text-trinity-900/60">
                Room type: {room.roomType}. Rate shown is per night, exclusive of taxes — see the Reservation
                Summary for the full breakdown.
              </p>
            )}
          </div>

          {room.amenities?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {room.amenities.map((a) => {
                const Icon = getAmenityIcon(a);
                return (
                  <span key={a} className="flex items-center gap-1.5 text-xs text-trinity-900/60">
                    <Icon size={14} className="text-trinity-500" />
                    {a}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
