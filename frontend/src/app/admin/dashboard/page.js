"use client";

import { TrendingUp, PieChart as PieIcon } from "lucide-react";
import Link from "next/link";
import Topbar from "@/components/admin/Topbar";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { useGetRoomsQuery } from "@/redux/api/roomApi";

const MOCK_TOTAL_BOOKINGS = 120;
const MOCK_TOTAL_CUSTOMERS = 80;
const MOCK_TOTAL_REVENUE = "1,45,000";

export default function DashboardPage() {
  const { data: allRoomsData } = useGetRoomsQuery({ limit: 1 });

  const { data: availableRoomsData } = useGetRoomsQuery({
    availabilityStatus: "Available",
    limit: 1,
  });

  const { data: previewRoomsData, isLoading: isRoomsLoading } =
    useGetRoomsQuery({ limit: 5 });

  const totalRooms = allRoomsData?.pagination?.totalRooms ?? "—";
  const availableRooms = availableRoomsData?.pagination?.totalRooms ?? "—";

  return (
    <div className="pb-10">
      <Topbar title="Admin Dashboard Overview" />

      <div className="space-y-6 px-8">
        {/* Stat cards row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Total Bookings"
            value={MOCK_TOTAL_BOOKINGS}
            trendIcon={TrendingUp}
          />
          <StatCard label="Total Customers" value={MOCK_TOTAL_CUSTOMERS} />
          <StatCard label="Total Revenue" value={`₹ ${MOCK_TOTAL_REVENUE}`} />
          <StatCard label="Total Rooms" value={totalRooms} />
          <StatCard
            label="Available Rooms"
            value={availableRooms}
            pieIcon={PieIcon}
          />
        </div>

        <div className="rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-semibold text-trinity-900">
              Rooms Inventory (CRUD)
            </h2>
            <Link
              href="/admin/rooms"
              className="rounded-lg bg-trinity-500 px-4 py-2 text-sm font-medium text-white hover:bg-trinity-600"
            >
              + Add New Room
            </Link>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-y border-black/5 text-trinity-900/60">
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
              {isRoomsLoading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-6 text-center text-trinity-900/50"
                  >
                    Loading...
                  </td>
                </tr>
              )}
              {previewRoomsData?.rooms?.map((room) => (
                <tr
                  key={room.roomId}
                  className="border-b border-black/5 last:border-0"
                >
                  <td className="px-6 py-4 font-medium">{room.roomId}</td>
                  <td className="px-6 py-4">{room.roomName}</td>
                  <td className="px-6 py-4">
                    {room.image ? (
                      <img
                        src={room.image}
                        alt={room.roomName}
                        className="h-10 w-14 rounded object-cover"
                      />
                    ) : (
                      <span className="text-xs text-trinity-900/40">
                        No image
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">₹ {room.basePrice}/night</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={room.availabilityStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href="/admin/rooms"
                      className="text-trinity-600 underline"
                    >
                      Edit Amenities
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-trinity-900/40">
                    <Link href="/admin/rooms" className="underline">
                      Manage in Rooms →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
