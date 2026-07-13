import { NextResponse } from "next/server";
import { mockHotel } from "@/data/mockHotel";

export async function GET(request, { params }) {
  const { slug } = await params;
  if (slug !== mockHotel.slug) {
    return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn");
  const nights = Number(searchParams.get("nights") || 1);

  return NextResponse.json({
    checkIn,
    nights,
    rooms: mockHotel.rooms.map((room) => ({
      id: room.id,
      available: true,
      price: room.price,
      mrp: room.mrp,
    })),
  });
}
