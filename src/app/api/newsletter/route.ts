import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all newsletter subscribers
export async function GET() {
  try {
    const subscribers = await db.newsletter.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await db.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.active) {
        return NextResponse.json({
          success: true,
          message: "You're already subscribed to our newsletter!",
        });
      } else {
        // Reactivate subscription
        await db.newsletter.update({
          where: { email },
          data: { active: true },
        });
        return NextResponse.json({
          success: true,
          message: "Welcome back! You've been resubscribed to our newsletter.",
        });
      }
    }

    const subscriber = await db.newsletter.create({
      data: {
        email,
        active: true,
      },
    });

    return NextResponse.json({
      success: true,
      subscriber,
      message: "Thank you for subscribing to our newsletter!",
    });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
