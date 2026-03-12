import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all approved reviews
export async function GET() {
  try {
    const reviews = await db.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, rating, comment, service } = body;

    // Validate required fields
    if (!name || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const review = await db.review.create({
      data: {
        name,
        rating: parseInt(rating),
        comment,
        service: service || null,
        approved: true, // Auto-approve for demo
      },
    });

    return NextResponse.json({
      success: true,
      review,
      message: "Thank you for your review!",
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
