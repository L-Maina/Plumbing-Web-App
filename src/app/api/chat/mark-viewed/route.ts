import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Mark all pending chat handoffs as viewed (clears the alert)
export async function POST(request: NextRequest) {
  try {
    // When admin views the live chat page, clear handoffRequested flag 
    // and set needsHuman to true (admin is now aware and should respond)
    const result = await db.chatSession.updateMany({
      where: { 
        handoffRequested: true,
        takenOver: false,
        finished: false
      },
      data: { 
        handoffRequested: false,
        needsHuman: true 
      },
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error("Error marking chats as viewed:", error);
    return NextResponse.json({ error: "Failed to mark chats as viewed" }, { status: 500 });
  }
}
