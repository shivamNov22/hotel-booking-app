"use client";

import Topbar from "@/components/admin/Topbar";
import BookingsTable from "@/components/admin/BookingsTable";
import { useGetAdminBookingsQuery } from "@/redux/api/bookingApi";

// Simple booking list — no search/filter/pagination per requirements.
// limit is set high enough that everything comes back in one page.
export default function BookingsPage() {
  const { data, isLoading, isFetching } = useGetAdminBookingsQuery({ limit: 200 });

  return (
    <div className="pb-10">
      <Topbar title="Bookings Management" />

      <div className="px-8">
        <div className="rounded-2xl bg-white shadow-sm">
          <div className="border-b border-black/5 px-6 py-4">
            <p className="text-sm text-trinity-900/60">
              {typeof data?.total === "number" ? `${data.total} booking${data.total === 1 ? "" : "s"} total` : "All bookings"}
            </p>
          </div>

          <BookingsTable bookings={data?.bookings} isLoading={isLoading || isFetching} />
        </div>
      </div>
    </div>
  );
}
