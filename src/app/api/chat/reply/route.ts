import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Send a reply as support
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message } = body;

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: "Session ID and message are required" },
        { status: 400 }
      );
    }

    // Get current session state
    const session = await db.chatSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Save the support message
    const supportMessage = await db.chatMessage.create({
      data: {
        sessionId,
        sender: "support",
        message,
      },
    });

    // Only update session state if not already taken over
    // This ensures multiple messages can be sent
    if (!session.takenOver) {
      await db.chatSession.update({
        where: { id: sessionId },
        data: { 
          takenOver: true,
          needsHuman: true,
          handoffRequested: false, // Clear handoff request since human has taken over
          updatedAt: new Date(),
        },
      });
    } else {
      // Just update the timestamp
      await db.chatSession.update({
        where: { id: sessionId },
        data: { 
          updatedAt: new Date(),
        },
      });
    }

    // Get updated session with messages
    const updatedSession = await db.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: supportMessage,
      session: updatedSession ? {
        id: updatedSession.id,
        customerName: updatedSession.customerName,
        handoffRequested: updatedSession.handoffRequested,
        needsHuman: updatedSession.needsHuman,
        takenOver: updatedSession.takenOver,
        messages: updatedSession.messages.map(m => ({
          id: m.id,
          sender: m.sender,
          message: m.message,
          createdAt: m.createdAt.toISOString(),
        })),
        createdAt: updatedSession.createdAt.toISOString(),
      } : null
    });
  } catch (error) {
    console.error("Error sending reply:", error);
    return NextResponse.json(
      { error: "Failed to send reply" },
      { status: 500 }
    );
  }
}
