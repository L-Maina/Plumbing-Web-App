import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Save a chat message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message, sender } = body;

    if (!sessionId || !message || !sender) {
      return NextResponse.json(
        { error: "Session ID, message, and sender are required" },
        { status: 400 }
      );
    }

    const chatMessage = await db.chatMessage.create({
      data: {
        sessionId,
        message,
        sender,
      },
    });

    // Update session's updatedAt
    await db.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(chatMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }
}
