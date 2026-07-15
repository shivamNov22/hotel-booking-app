"use client";

import { TrendingUp, PieChart as PieIcon, IndianRupee } from "lucide-react";
import Link from "next/link";
import Topbar from "@/components/admin/Topbar";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { useGetRoomsQuery } from "@/redux/api/roomApi";
import { useGetAdminBookingsQuery } from "@/redux/api/bookingApi";

export default function DashboardPage() {
  const { data: allRoomsData } = useGetRoomsQuery({ limit: 1 });

  const { data: availableRoomsData } = useGetRoomsQuery({
    availabilityStatus: "Available",
    limit: 1,
  });

  const { data: previewRoomsData, isLoading: isRoomsLoading } =
    useGetRoomsQuery({ limit: 5 });

  const { data: bookingsData, isLoading: isBookingsLoading } =
    useGetAdminBookingsQuery({ limit: 200 });

  const totalRooms = allRoomsData?.pagination?.totalRooms ?? "—";
  const availableRooms = availableRoomsData?.pagination?.totalRooms ?? "—";

  const totalBookings = bookingsData?.total ?? "—";
  const totalRevenue =
    bookingsData?.bookings?.reduce(
      (sum, b) => sum + (b.pricingBreakdown?.grandTotal ?? 0),
      0,
    ) ?? 0;

  return (
    <div className="pb-10">
      <Topbar title="Admin Dashboard Overview" />

      <div className="space-y-6 px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Bookings"
            value={isBookingsLoading ? "—" : totalBookings}
            trendIcon={TrendingUp}
          />
          <StatCard
            label="Total Revenue"
            value={
              isBookingsLoading
                ? "—"
                : `₹ ${totalRevenue.toLocaleString("en-IN")}`
            }
            trendIcon={IndianRupee}
          />
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
                      // eslint-disable-next-line @next/next/no-img-element
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
