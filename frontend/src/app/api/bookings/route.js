import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  if (!body?.guestInfo?.email || !body?.guestInfo?.firstName) {
    return NextResponse.json(
      { message: "Guest first name and email are required." },
      { status: 400 }
    );
  }

  const confirmationNumber = `TS${Date.now().toString().slice(-8)}`;

  return NextResponse.json(
    {
      confirmationNumber,
      status: "confirmed",
      receivedAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
