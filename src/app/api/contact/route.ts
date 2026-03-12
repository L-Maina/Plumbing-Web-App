import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all contact messages
export async function GET() {
  try {
    const contacts = await db.contact.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

// POST - Create a new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const contact = await db.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: "new",
      },
    });

    // Notify admin about new contact message (non-blocking)
    fetch(`http://localhost:3000/api/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "new_contact",
        data: {
          name,
          email,
          phone: phone || null,
          subject,
          message
        }
      })
    }).catch(err => console.error("Failed to notify admin:", err));

    return NextResponse.json({
      success: true,
      contact,
      message: "Message sent successfully! We will get back to you soon.",
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
