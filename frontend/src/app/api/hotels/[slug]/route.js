import { NextResponse } from "next/server";
import { mockHotel } from "@/data/mockHotel";

export async function GET(_request, { params }) {
  const { slug } = await params;

  if (slug !== mockHotel.slug) {
    return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
  }

  return NextResponse.json(mockHotel);
}
