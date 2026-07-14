"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAddRoomMutation, useEditRoomMutation } from "@/redux/api/roomApi";

const ROOM_TYPES = ["Executive Suite", "Deluxe", "Single"];
const STATUS_OPTIONS = ["Available", "Occupied", "Maintenance"];

const EMPTY_FORM = {
  roomName: "",
  roomType: "Executive Suite",
  image: "",
  basePrice: "",
  availabilityStatus: "Available",
  amenities: "", // comma-separated in the UI, split into an array on submit
};

export default function RoomFormModal({ open, onClose, editingRoom }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const [addRoom, { isLoading: isAdding }] = useAddRoomMutation();
  const [editRoom, { isLoading: isEditing }] = useEditRoomMutation();

  const isEditMode = Boolean(editingRoom);
  const isSaving = isAdding || isEditing;

  useEffect(() => {
    if (editingRoom) {
      setForm({
        roomName: editingRoom.roomName || "",
        roomType: editingRoom.roomType || "Executive Suite",
        image: editingRoom.image || "",
        basePrice: editingRoom.basePrice ?? "",
        availabilityStatus: editingRoom.availabilityStatus || "Available",
        amenities: (editingRoom.amenities || []).join(", "),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError("");
  }, [editingRoom, open]);

  if (!open) return null;

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      roomName: form.roomName.trim(),
      roomType: form.roomType,
      image: form.image.trim(),
      basePrice: Number(form.basePrice),
      availabilityStatus: form.availabilityStatus,
      amenities: form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    };

    try {
      if (isEditMode) {
        await editRoom({ roomId: editingRoom.roomId, ...payload }).unwrap();
      } else {
        await addRoom(payload).unwrap();
      }
      onClose();
    } catch (err) {
      setError(err?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-trinity-900">
            {isEditMode ? `Edit Room — ${editingRoom.roomId}` : "Add New Room"}
          </h3>
          <button type="button" onClick={onClose} className="text-trinity-900/50 hover:text-trinity-900">
            <X size={20} />
          </button>
        </div>

        {error && (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-trinity-900/80">Room Name</label>
            <input
              required
              value={form.roomName}
              onChange={handleChange("roomName")}
              placeholder="e.g. Executive Suite"
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-trinity-900/80">Room Type</label>
              <select
                value={form.roomType}
                onChange={handleChange("roomType")}
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
              >
                {ROOM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-trinity-900/80">Availability</label>
              <select
                value={form.availabilityStatus}
                onChange={handleChange("availabilityStatus")}
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-trinity-900/80">Image URL</label>
            <input
              value={form.image}
              onChange={handleChange("image")}
              placeholder="https://..."
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-trinity-900/80">
              Base Price (₹ / night)
            </label>
            <input
              required
              type="number"
              min="0"
              value={form.basePrice}
              onChange={handleChange("basePrice")}
              placeholder="4500"
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-trinity-900/80">
              Amenities <span className="font-normal text-trinity-900/50">(comma-separated)</span>
            </label>
            <input
              value={form.amenities}
              onChange={handleChange("amenities")}
              placeholder="WiFi, AC, TV, Mini Bar"
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-trinity-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-trinity-900/70 hover:bg-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-trinity-500 px-4 py-2 text-sm font-medium text-white hover:bg-trinity-600 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : isEditMode ? "Save Changes" : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
