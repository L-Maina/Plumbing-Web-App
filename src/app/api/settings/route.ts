import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch site settings
export async function GET() {
  try {
    // Get or create settings (singleton pattern)
    let settings = await db.siteSettings.findFirst();
    
    if (!settings) {
      settings = await db.siteSettings.create({
        data: {},
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update site settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get existing settings or create new
    let settings = await db.siteSettings.findFirst();
    
    if (!settings) {
      settings = await db.siteSettings.create({
        data: body,
      });
    } else {
      settings = await db.siteSettings.update({
        where: { id: settings.id },
        data: body,
      });
    }
    
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
