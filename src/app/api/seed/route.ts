import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Seed default data if not exists
export async function GET() {
  try {
    // Check if services exist
    const existingServices = await db.service.findMany();
    
    if (existingServices.length === 0) {
      // Seed default services
      const defaultServices = [
        {
          title: "Plumbing Installation",
          description: "Complete plumbing installation for new buildings and renovations. We install pipes, fixtures, and water systems with precision.",
          icon: "Wrench",
          order: 0,
          active: true,
        },
        {
          title: "Pipe Repairs & Maintenance",
          description: "Expert pipe repair services for leaks, bursts, and blockages. We ensure your plumbing system runs smoothly.",
          icon: "Droplets",
          order: 1,
          active: true,
        },
        {
          title: "Water Heater Services",
          description: "Installation, repair, and maintenance of water heaters. Get hot water flowing reliably in your home or business.",
          icon: "Thermometer",
          order: 2,
          active: true,
        },
        {
          title: "Bathroom Renovation",
          description: "Complete bathroom renovation services. From design to installation, we transform your bathroom into a modern space.",
          icon: "Bath",
          order: 3,
          active: true,
        },
        {
          title: "Emergency Plumbing",
          description: "24/7 emergency plumbing services. We're always available for urgent plumbing issues. Call us anytime.",
          icon: "AlertTriangle",
          order: 4,
          active: true,
        },
      ];

      await db.service.createMany({
        data: defaultServices,
      });

      console.log("Seeded default services");
    }

    // Check if site settings exist
    const existingSettings = await db.siteSettings.findFirst();
    
    if (!existingSettings) {
      await db.siteSettings.create({
        data: {
          businessName: "Climate Tech Plumbing & Renovators",
          phone: "0720 219802",
          email: "info@climatetechplumbing.co.ke",
          address: "Thika Rd, Nairobi, Kenya",
          businessHours: "24/7 Emergency Services Available",
          heroTitle: "Professional Plumbing & Borehole Services",
          heroSubtitle: "Expert solutions for all your plumbing, borehole drilling, and water system needs in Nairobi & Kenya",
          aboutTitle: "About Climate Tech Plumbing",
          aboutContent: "We are a professional plumbing company dedicated to providing high-quality services.",
          facebook: "https://facebook.com",
          twitter: "https://x.com",
          instagram: "https://instagram.com",
          whatsapp: "254720219802",
        },
      });

      console.log("Seeded default site settings");
    }

    return NextResponse.json({ 
      success: true, 
      message: "Seed completed",
      servicesCount: (await db.service.findMany()).length,
      settingsExist: !!(await db.siteSettings.findFirst())
    });
  } catch (error) {
    console.error("Error seeding data:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to seed data" 
    }, { status: 500 });
  }
}

// POST - Force reseed services
export async function POST() {
  try {
    // Delete existing services
    await db.service.deleteMany();
    
    // Seed default services
    const defaultServices = [
      {
        title: "Plumbing Installation",
        description: "Complete plumbing installation for new buildings and renovations. We install pipes, fixtures, and water systems with precision.",
        icon: "Wrench",
        order: 0,
        active: true,
      },
      {
        title: "Pipe Repairs & Maintenance",
        description: "Expert pipe repair services for leaks, bursts, and blockages. We ensure your plumbing system runs smoothly.",
        icon: "Droplets",
        order: 1,
        active: true,
      },
      {
        title: "Water Heater Services",
        description: "Installation, repair, and maintenance of water heaters. Get hot water flowing reliably in your home or business.",
        icon: "Thermometer",
        order: 2,
        active: true,
      },
      {
        title: "Bathroom Renovation",
        description: "Complete bathroom renovation services. From design to installation, we transform your bathroom into a modern space.",
        icon: "Bath",
        order: 3,
        active: true,
      },
      {
        title: "Emergency Plumbing",
        description: "24/7 emergency plumbing services. We're always available for urgent plumbing issues. Call us anytime.",
        icon: "AlertTriangle",
        order: 4,
        active: true,
      },
    ];

    await db.service.createMany({
      data: defaultServices,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Services reseeded successfully" 
    });
  } catch (error) {
    console.error("Error reseeding services:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to reseed services" 
    }, { status: 500 });
  }
}
