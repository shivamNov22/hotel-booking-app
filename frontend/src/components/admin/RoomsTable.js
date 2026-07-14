"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";

export default function RoomsTable({ rooms, isLoading, onEdit, onEditAmenities, onDelete }) {
  if (isLoading) {
    return <p className="px-6 py-10 text-center text-sm text-trinity-900/50">Loading rooms...</p>;
  }

  if (!rooms || rooms.length === 0) {
    return (
      <p className="px-6 py-10 text-center text-sm text-trinity-900/50">
        No rooms found. Try adjusting your search or filters, or add a new room.
      </p>
    );
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-black/5 text-trinity-900/60">
          <th className="px-6 py-3 font-medium">Room ID</th>
          <th className="px-6 py-3 font-medium">Room Name</th>
          <th className="px-6 py-3 font-medium">Image</th>
          <th className="px-6 py-3 font-medium">Base Price</th>
          <th className="px-6 py-3 font-medium">Availability Status</th>
          <th className="px-6 py-3 font-medium">Amenities (Manage)</th>
          <th className="px-6 py-3 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (
          <tr key={room.roomId} className="border-b border-black/5 last:border-0">
            <td className="px-6 py-4 font-medium text-trinity-900">{room.roomId}</td>
            <td className="px-6 py-4">{room.roomName}</td>
            <td className="px-6 py-4">
              {room.image ? (
                <div className="relative h-12 w-16 overflow-hidden rounded-md bg-cream">
                  <Image src={room.image} alt={room.roomName} fill sizes="64px" className="object-cover" />
                </div>
              ) : (
                <div className="flex h-12 w-16 items-center justify-center rounded-md bg-cream text-[10px] text-trinity-900/40">
                  No image
                </div>
              )}
            </td>
            <td className="px-6 py-4">₹ {room.basePrice}/night</td>
            <td className="px-6 py-4">
              <StatusBadge status={room.availabilityStatus} />
            </td>
            <td className="px-6 py-4">
              <button
                type="button"
                onClick={() => onEditAmenities(room)}
                className="text-trinity-600 underline hover:text-trinity-700"
              >
                Edit Amenities
              </button>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(room)}
                  className="text-trinity-900/60 hover:text-trinity-700"
                  aria-label={`Edit ${room.roomId}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(room)}
                  className="text-trinity-900/60 hover:text-red-600"
                  aria-label={`Delete ${room.roomId}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
