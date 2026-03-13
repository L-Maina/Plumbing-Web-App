import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    let settings = await db.siteSettings.findFirst();
    if (!settings) {
      settings = await db.siteSettings.create({ data: {} });
    }
    return NextResponse.json(settings, {
      headers: { 'Cache-Control': 'no-store, no-cache' }
    });
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let settings = await db.siteSettings.findFirst();
    if (!settings) {
      settings = await db.siteSettings.create({ data: body });
    } else {
      settings = await db.siteSettings.update({
        where: { id: settings.id },
        data: body
      });
    }
    return NextResponse.json({ success: true, settings });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
