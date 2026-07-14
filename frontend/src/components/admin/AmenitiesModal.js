"use client";

import { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { useUpdateAmenitiesMutation } from "@/redux/api/roomApi";

export default function AmenitiesModal({ open, onClose, room }) {
  const [amenities, setAmenities] = useState([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  const [updateAmenities, { isLoading }] = useUpdateAmenitiesMutation();

  useEffect(() => {
    if (room) setAmenities(room.amenities || []);
    setDraft("");
    setError("");
  }, [room, open]);

  if (!open || !room) return null;

  const addAmenity = () => {
    const value = draft.trim();
    if (value && !amenities.includes(value)) {
      setAmenities((a) => [...a, value]);
    }
    setDraft("");
  };

  const removeAmenity = (value) => {
    setAmenities((a) => a.filter((item) => item !== value));
  };

  const handleSave = async () => {
    setError("");
    try {
      await updateAmenities({ roomId: room.roomId, amenities }).unwrap();
      onClose();
    } catch (err) {
      setError(err?.data?.message || "Failed to update amenities.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-trinity-900">
            Edit Amenities — {room.roomId}
          </h3>
          <button type="button" onClick={onClose} className="text-trinity-900/50 hover:text-trinity-900">
            <X size={20} />
          </button>
        </div>

        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <div className="mb-3 flex flex-wrap gap-2">
          {amenities.map((a) => (
            <span
              key={a}
              className="flex items-center gap-1 rounded-full bg-trinity-100 px-3 py-1 text-sm text-trinity-700"
            >
              {a}
              <button type="button" onClick={() => removeAmenity(a)} className="hover:text-trinity-900">
                <X size={14} />
              </button>
            </span>
          ))}
          {amenities.length === 0 && (
            <p className="text-sm text-trinity-900/50">No amenities added yet.</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAmenity();
              }
            }}
            placeholder="e.g. Room Service"
            className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={addAmenity}
            className="flex items-center gap-1 rounded-lg bg-trinity-100 px-3 py-2 text-sm text-trinity-700 hover:bg-trinity-100/70"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-trinity-900/70 hover:bg-cream"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="rounded-lg bg-trinity-500 px-4 py-2 text-sm font-medium text-white hover:bg-trinity-600 disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Save Amenities"}
          </button>
        </div>
      </div>
    </div>
  );
}
