import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Create a new chat session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { customerName } = body;
    
    const session = await db.chatSession.create({
      data: {
        customerName: customerName || null,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
