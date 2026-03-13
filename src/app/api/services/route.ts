import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all services
export async function GET() {
  try {
    const services = await db.service.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json([]);
  }
}

// POST create new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, icon, image, order } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const service = await db.service.create({
      data: {
        title,
        description,
        icon: icon || "Wrench",
        image: image || null,
        order: order || 0,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

// PUT update service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, icon, image, active, order } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      );
    }

    const service = await db.service.update({
      where: { id },
      data: {
        title,
        description,
        icon,
        image,
        active,
        order,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE service
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      );
    }

    await db.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
