"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageOff, Loader2 } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { getAmenityIcon } from "@/lib/amenityIcons";
import { useLazyGetBookingDetailsQuery } from "@/redux/api/bookingApi";

function todayISO() {
  return new Date().toISOString().split("T")[0];
}
function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

const UNAVAILABLE_NOTE = {
  Occupied: "Fully booked for now — check back soon.",
  Maintenance: "Temporarily under maintenance.",
};

export default function RoomCard({ room }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(tomorrowISO());
  const [dateError, setDateError] = useState("");
  const [bookError, setBookError] = useState("");

  const [triggerGetDetails, { isFetching: isBooking }] = useLazyGetBookingDetailsQuery();

  const isAvailable = room.availabilityStatus === "Available";

  const handleBook = async () => {
    setBookError("");
    if (checkOut <= checkIn) {
      setDateError("Check-out must be after check-in.");
      return;
    }
    setDateError("");

    // Call the booking API (room + price preview) before navigating — this
    // both validates the room/dates server-side and gives /booking a fresh
    // cache entry to read from immediately on arrival.
    try {
      await triggerGetDetails({ roomId: room.roomId, checkIn, checkOut }).unwrap();
      router.push(`/booking?roomId=${room.roomId}&checkIn=${checkIn}&checkOut=${checkOut}`);
    } catch (err) {
      setBookError(err?.data?.message || "Couldn't start this booking. Please try again.");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">
      <div className="relative h-56 w-full bg-cream">
        {room.image ? (
          <Image src={room.image} alt={room.roomName} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-trinity-900/30">
            <ImageOff size={32} />
            <span className="text-xs">Image not available</span>
          </div>
        )}
        <div className="absolute right-3 top-3">
          <StatusBadge status={room.availabilityStatus} />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-lg font-semibold text-trinity-900">{room.roomName}</h3>
          {/* Room schema has no free-text description field yet — showing the
              room type as a subtitle instead of inventing placeholder copy.
              Add a `description` field to the Room model later if real
              per-room copy is wanted here. */}
          <p className="text-sm text-trinity-900/50">{room.roomType}</p>
        </div>

        {room.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-3">
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

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-trinity-900">₹{room.basePrice}</span>
          <span className="text-sm text-trinity-900/50">/ night</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-trinity-900/60">Check-in</span>
            <input
              type="date"
              value={checkIn}
              min={todayISO()}
              onChange={(e) => setCheckIn(e.target.value)}
              disabled={!isAvailable}
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm disabled:bg-cream disabled:text-trinity-900/30 focus:border-trinity-500 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-trinity-900/60">Check-out</span>
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              disabled={!isAvailable}
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm disabled:bg-cream disabled:text-trinity-900/30 focus:border-trinity-500 focus:outline-none"
            />
          </label>
        </div>

        {dateError && <p className="text-xs text-red-600">{dateError}</p>}
        {bookError && <p className="text-xs text-red-600">{bookError}</p>}

        <button
          type="button"
          disabled={!isAvailable || isBooking}
          onClick={handleBook}
          className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors ${
            isAvailable
              ? "bg-trinity-500 text-white hover:bg-trinity-600 disabled:opacity-70"
              : "cursor-not-allowed bg-cream text-trinity-900/30"
          }`}
        >
          {isBooking && <Loader2 size={16} className="animate-spin" />}
          {isBooking ? "Checking availability..." : "Book This Room"}
        </button>

        {!isAvailable && (
          <p className="text-center text-xs text-trinity-900/40">
            {UNAVAILABLE_NOTE[room.availabilityStatus] || "Currently unavailable."}
          </p>
        )}
      </div>
    </div>
  );
}
