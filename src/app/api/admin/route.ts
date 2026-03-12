import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all admin data (bookings, contacts, newsletter subscribers)
export async function GET(request: NextRequest) {
  try {
    const [bookings, contacts, newsletters, reviews] = await Promise.all([
      db.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      db.contact.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      db.newsletter.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      db.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    // Get stats
    const stats = {
      totalBookings: await db.booking.count(),
      pendingBookings: await db.booking.count({ where: { status: "pending" } }),
      confirmedBookings: await db.booking.count({ where: { status: "confirmed" } }),
      completedBookings: await db.booking.count({ where: { status: "completed" } }),
      totalContacts: await db.contact.count(),
      newContacts: await db.contact.count({ where: { status: "new" } }),
      totalSubscribers: await db.newsletter.count({ where: { active: true } }),
      totalReviews: await db.review.count(),
    };

    return NextResponse.json({
      bookings,
      contacts,
      newsletters,
      reviews,
      stats,
    });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin data" },
      { status: 500 }
    );
  }
}

// PATCH - Update booking status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, status } = body;

    if (type === "booking") {
      const booking = await db.booking.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json({ success: true, booking });
    }

    if (type === "contact") {
      const contact = await db.contact.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json({ success: true, contact });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error updating:", error);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a record
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    if (type === "booking") {
      await db.booking.delete({ where: { id } });
    } else if (type === "contact") {
      await db.contact.delete({ where: { id } });
    } else if (type === "newsletter") {
      await db.newsletter.delete({ where: { id } });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting:", error);
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}
