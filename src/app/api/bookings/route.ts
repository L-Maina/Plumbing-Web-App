import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all bookings
export async function GET() {
  try {
    const bookings = await db.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, date, time, address, notes } = body;

    // Validate required fields
    if (!name || !email || !phone || !service || !date || !time || !address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const booking = await db.booking.create({
      data: {
        name,
        email,
        phone,
        service,
        date,
        time,
        address,
        notes: notes || null,
        status: "pending",
      },
    });

    // Notify admin about new booking (non-blocking)
    fetch(`http://localhost:3000/api/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "new_booking",
        data: {
          name,
          email,
          phone,
          service,
          date,
          time,
          address,
          notes
        }
      })
    }).catch(err => console.error("Failed to notify admin:", err));

    return NextResponse.json({
      success: true,
      booking,
      message: "Booking created successfully! We will contact you shortly to confirm.",
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
