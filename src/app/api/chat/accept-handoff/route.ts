import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Admin accepts the handoff request
// This sets needsHuman to true so admin can start responding
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get session info
    const session = await db.chatSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Update session to mark as needsHuman (admin approved the handoff)
    // This allows admin to respond immediately
    const updatedSession = await db.chatSession.update({
      where: { id: sessionId },
      data: { 
        needsHuman: true,
        // Keep handoffRequested true so the UI knows this was a handoff
        // Clear it only when support sends a message (takenOver = true)
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Handoff accepted. You can now respond to the customer.",
      session: {
        id: updatedSession.id,
        customerName: updatedSession.customerName,
        handoffRequested: updatedSession.handoffRequested,
        needsHuman: updatedSession.needsHuman,
        takenOver: updatedSession.takenOver,
        createdAt: updatedSession.createdAt.toISOString(),
      }
    });
  } catch (error) {
    console.error("Error accepting handoff:", error);
    return NextResponse.json(
      { error: "Failed to accept handoff" },
      { status: 500 }
    );
  }
}
