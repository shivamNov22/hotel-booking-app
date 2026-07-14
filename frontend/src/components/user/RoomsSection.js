"use client";

import { useGetRoomsQuery } from "@/redux/api/roomApi";
import RoomCard from "./RoomCard";
import RoomCardSkeleton from "./RoomCardSkeleton";

export default function RoomsSection() {
  // Reusing the Admin Room Inventory endpoint — there's no separate public
  // rooms-listing API yet. This works only because that route is currently
  // unauthenticated; once it gets an admin auth guard (flagged as a Known Gap
  // in the backend README), build a dedicated public `GET /api/rooms`
  // endpoint and swap this hook for that instead.
  const { data, isLoading, isError } = useGetRoomsQuery({ limit: 100, sortBy: "roomId_asc" });

  return (
    <section id="rooms-collection" className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-8 text-3xl font-semibold text-trinity-900">Suite &amp; Room Collection</h2>

      {isError && (
        <p className="py-10 text-center text-red-600">
          Couldn&apos;t load rooms right now. Please try again shortly.
        </p>
      )}

      {!isLoading && !isError && data?.rooms?.length === 0 && (
        <p className="py-10 text-center text-trinity-900/50">No rooms available right now.</p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <RoomCardSkeleton key={i} />)}
        {!isLoading &&
          !isError &&
          data?.rooms?.map((room) => <RoomCard key={room.roomId} room={room} />)}
      </div>
    </section>
  );
}
