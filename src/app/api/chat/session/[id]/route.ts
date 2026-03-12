import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Demo phone for testing
const DEMO_PHONE = "0706605553";

// GET - Get session details (for customer polling)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await db.chatSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: session.id,
      customerName: session.customerName,
      handoffRequested: session.handoffRequested,
      needsHuman: session.needsHuman,
      takenOver: session.takenOver,
      messages: session.messages.map(m => ({
        id: m.id,
        sender: m.sender,
        message: m.message,
        createdAt: m.createdAt.toISOString(),
      })),
      createdAt: session.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}

// PATCH - Update session (mark handoff requested, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    
    if (body.handoffRequested !== undefined) {
      updateData.handoffRequested = body.handoffRequested;
    }
    
    if (body.needsHuman !== undefined) {
      updateData.needsHuman = body.needsHuman;
    }
    
    if (body.takenOver !== undefined) {
      updateData.takenOver = body.takenOver;
    }
    
    if (body.customerName !== undefined) {
      updateData.customerName = body.customerName;
    }

    const session = await db.chatSession.update({
      where: { id },
      data: updateData,
    });

    // If handoff requested, send SMS notification
    if (body.handoffRequested) {
      console.log('📱 SMS NOTIFICATION');
      console.log('═════════════════════════════════════');
      console.log(`To: ${DEMO_PHONE} (Demo Mode)`);
      console.log(`Message: CLIMATE TECH: Customer needs assistance! Open admin dashboard to respond.`);
      console.log('═════════════════════════════════════');
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error updating session:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}
