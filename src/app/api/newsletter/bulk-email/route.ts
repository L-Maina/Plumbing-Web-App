import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST - Send bulk email to all subscribers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, content } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { error: "Subject and content are required" },
        { status: 400 }
      );
    }

    // Get all active subscribers
    const subscribers = await db.newsletter.findMany({
      where: { active: true },
      select: { email: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: "No subscribers found" },
        { status: 400 }
      );
    }

    // Log the bulk email (in production, this would use Resend or similar)
    console.log("═════════════════════════════════════");
    console.log("📧 BULK EMAIL NOTIFICATION");
    console.log("═════════════════════════════════════");
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${content}`);
    console.log(`Recipients: ${subscribers.length}`);
    console.log(`Emails: ${subscribers.map(s => s.email).join(", ")}`);
    console.log("═════════════════════════════════════");

    // In production, uncomment and configure with Resend:
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // 
    // const results = await Promise.allSettled(
    //   subscribers.map(sub => 
    //     resend.emails.send({
    //       from: 'Climate Tech Plumbing <noreply@climatetechplumbing.co.ke>',
    //       to: sub.email,
    //       subject: subject,
    //       html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    //         <h2 style="color: #059669;">${subject}</h2>
    //         <p style="color: #374151; line-height: 1.6;">${content}</p>
    //         <hr style="margin: 24px 0; border-color: #e5e7eb;">
    //         <p style="color: #6b7280; font-size: 12px;">
    //           Climate Tech Plumbing & Renovators<br>
    //           📞 0720 219802 | Available 24/7<br>
    //           <a href="https://climatetechplumbing.co.ke" style="color: #059669;">Visit our website</a>
    //         </p>
    //       </div>`,
    //     })
    //   )
    // );

    // Simulate success for demo
    const sent = subscribers.length;
    const failed = 0;

    return NextResponse.json({
      success: true,
      sent,
      failed,
      message: `Email sent to ${sent} subscribers`,
    });
  } catch (error) {
    console.error("Error sending bulk email:", error);
    return NextResponse.json(
      { error: "Failed to send bulk email" },
      { status: 500 }
    );
  }
}
