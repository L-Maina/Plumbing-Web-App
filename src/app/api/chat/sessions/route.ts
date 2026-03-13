import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Get all chat sessions
export async function GET() {
  try {
    const sessions = await db.chatSession.findMany({
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform sessions to match the expected format
    const formattedSessions = sessions.map(session => ({
      id: session.id,
      customerName: session.customerName,
      handoffRequested: session.handoffRequested,
      needsHuman: session.needsHuman,
      takenOver: session.takenOver,
      finished: session.finished,
      messages: session.messages.map(msg => ({
        id: msg.id,
        sender: msg.sender,
        message: msg.message,
        createdAt: msg.createdAt.toISOString(),
      })),
      createdAt: session.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedSessions);
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json([], { status: 200 });
  }
}
