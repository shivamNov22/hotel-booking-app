import { NextResponse } from "next/server";

const VALID_CODES = {
  SAVE10: 0.1,
  WELCOME500: 500,
  TRINITY5: 0.05,
};

export async function POST(request) {
  const body = await request.json();
  const code = (body.code || "").trim().toUpperCase();
  const subtotal = Number(body.subtotal || 0);

  if (!code) {
    return NextResponse.json(
      { message: "Please enter a promo code." },
      { status: 400 }
    );
  }

  if (!(code in VALID_CODES)) {
    return NextResponse.json(
      { message: "This promo code is invalid or has expired." },
      { status: 404 }
    );
  }

  const rule = VALID_CODES[code];
  const discountAmount =
    rule < 1 ? Math.round(subtotal * rule * 100) / 100 : rule;

  return NextResponse.json({
    code,
    discountAmount,
    message: `Promo code ${code} applied successfully.`,
  });
}
