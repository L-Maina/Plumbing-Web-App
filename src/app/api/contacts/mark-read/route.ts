import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Mark all contacts as read
export async function POST(request: NextRequest) {
  try {
    const result = await db.contact.updateMany({
      where: { status: "new" },
      data: { status: "read" },
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error("Error marking contacts as read:", error);
    return NextResponse.json({ error: "Failed to mark contacts as read" }, { status: 500 });
  }
}
