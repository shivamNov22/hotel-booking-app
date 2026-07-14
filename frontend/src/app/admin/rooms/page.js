"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import FiltersBar from "@/components/admin/FiltersBar";
import RoomsTable from "@/components/admin/RoomsTable";
import Pagination from "@/components/admin/Pagination";
import RoomFormModal from "@/components/admin/RoomFormModal";
import AmenitiesModal from "@/components/admin/AmenitiesModal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useGetRoomsQuery, useDeleteRoomMutation } from "@/redux/api/roomApi";

const DEFAULT_FILTERS = {
  search: "",
  roomType: "",
  availabilityStatus: "",
  sortBy: "roomId_asc",
  page: 1,
};

export default function RoomsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [limit, setLimit] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [amenitiesRoom, setAmenitiesRoom] = useState(null);
  const [deletingRoom, setDeletingRoom] = useState(null);

  const { data, isLoading, isFetching } = useGetRoomsQuery({ ...filters, limit });
  const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();

  const handleAddNew = () => {
    setEditingRoom(null);
    setFormOpen(true);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRoom(deletingRoom.roomId).unwrap();
      setDeletingRoom(null);
    } catch (err) {
      // Keep the modal open and surface the error inline if needed later;
      // for now, log it — TODO: show a toast/error banner
      console.error("Failed to delete room:", err);
    }
  };

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between px-8 pt-6">
        <div>
          <p className="text-sm text-trinity-900/50">
            Admin <span className="mx-1">›</span> <span className="text-trinity-900">Room Inventory</span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddNew}
          className="flex items-center gap-2 rounded-lg bg-trinity-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-trinity-600"
        >
          <Plus size={16} /> Add New Room
        </button>
      </div>

      <div className="space-y-6 px-8 pt-6">
        <FiltersBar filters={filters} onChange={setFilters} />

        <div className="rounded-2xl bg-white shadow-sm">
          <RoomsTable
            rooms={data?.rooms}
            isLoading={isLoading || isFetching}
            onEdit={handleEdit}
            onEditAmenities={setAmenitiesRoom}
            onDelete={setDeletingRoom}
          />
          <Pagination
            pagination={data?.pagination}
            limit={limit}
            onLimitChange={(n) => {
              setLimit(n);
              setFilters((f) => ({ ...f, page: 1 }));
            }}
            onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
          />
        </div>
      </div>

      <RoomFormModal open={formOpen} onClose={() => setFormOpen(false)} editingRoom={editingRoom} />

      <AmenitiesModal
        open={Boolean(amenitiesRoom)}
        room={amenitiesRoom}
        onClose={() => setAmenitiesRoom(null)}
      />

      <ConfirmModal
        open={Boolean(deletingRoom)}
        title="Delete this room?"
        message={
          deletingRoom
            ? `"${deletingRoom.roomName}" (${deletingRoom.roomId}) will be permanently removed. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete Room"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingRoom(null)}
      />
    </div>
  );
}
