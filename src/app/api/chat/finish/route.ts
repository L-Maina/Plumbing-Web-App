import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Finish a chat session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const session = await db.chatSession.update({
      where: { id: sessionId },
      data: { 
        finished: true,
        takenOver: false,
        needsHuman: false,
        handoffRequested: false
      },
    });

    // Add a system message that conversation is finished
    await db.chatMessage.create({
      data: {
        sessionId,
        sender: "bot",
        message: "This conversation has been ended by the support team. Thank you for contacting Climate Tech Plumbing! If you need further assistance, feel free to start a new chat.",
      },
    });

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("Error finishing session:", error);
    return NextResponse.json({ error: "Failed to finish session" }, { status: 500 });
  }
}
