import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const bookings = await db.booking.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const booking = await db.booking.create({ data });
    return NextResponse.json({ success: true, booking });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
