import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create site settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      heroTitle: 'Professional Plumbing & Renovation Services',
      heroSubtitle: 'Expert solutions for all your plumbing needs in Nairobi',
      heroDescription: 'From emergency repairs to complete renovations, we deliver quality workmanship with a commitment to excellence.',
      heroButtonText: 'Get Free Quote',
      heroButtonLink: '#contact',
      aboutTitle: 'About Climate Tech Plumbing',
      aboutSubtitle: 'Your Trusted Plumbing Partner Since 2010',
      aboutDescription: 'Climate Tech Plumbing & Renovators has been serving Nairobi and its environs with professional plumbing services for over a decade. Our team of certified plumbers combines expertise with modern technology to deliver exceptional results.',
      aboutYearsExperience: 14,
      aboutProjectsCompleted: 5000,
      aboutHappyClients: 3500,
      businessName: 'Climate Tech Plumbing & Renovators',
      phone: '0720 219802',
      email: 'info@climatetechplumbing.co.ke',
      address: 'Thika Rd, Nairobi, Kenya',
      whatsappNumber: '254720219802',
      isOpen247: false,
      mondayOpen: '08:00',
      mondayClose: '18:00',
      tuesdayOpen: '08:00',
      tuesdayClose: '18:00',
      wednesdayOpen: '08:00',
      wednesdayClose: '18:00',
      thursdayOpen: '08:00',
      thursdayClose: '18:00',
      fridayOpen: '08:00',
      fridayClose: '18:00',
      saturdayOpen: '09:00',
      saturdayClose: '16:00',
      sundayOpen: '10:00',
      sundayClose: '14:00',
      siteName: 'Climate Tech Plumbing',
      siteTagline: 'Professional Plumbing Services in Nairobi',
      siteDescription: 'Climate Tech Plumbing offers professional plumbing, renovation, and maintenance services in Nairobi, Kenya. Available 24/7 for emergencies.',
      siteKeywords: 'plumbing, plumber, nairobi, kenya, renovations, repairs, emergency plumbing',
      primaryColor: '#0ea5e9',
      secondaryColor: '#0284c7',
      accentColor: '#06b6d4',
      showReviews: true,
      showBlog: true,
      showNewsletter: true,
      showFaq: true,
      showLiveChat: true,
      aiChatEnabled: true,
      aiChatWelcomeMessage: 'Hello! How can I help you with your plumbing needs today?',
      aiChatGreeting: 'Chat with our AI assistant',
      footerCopyright: '© 2024 Climate Tech Plumbing & Renovators. All rights reserved.',
    },
    update: {},
  })

  console.log('Created site settings:', settings.id)

  // Create services
  const services = [
    {
      name: 'Emergency Plumbing',
      slug: 'emergency-plumbing',
      shortDescription: '24/7 emergency plumbing services for urgent repairs',
      description: 'Our emergency plumbing team is available around the clock to handle urgent plumbing issues. From burst pipes to severe leaks, we respond quickly to minimize damage and restore your plumbing system.',
      icon: 'AlertTriangle',
      price: 5000,
      priceType: 'quote',
      duration: 'Immediate response',
      features: ['24/7 availability', 'Quick response time', 'Fully equipped service vehicles', 'Experienced emergency plumbers'],
      isPopular: true,
      isActive: true,
      displayOrder: 1,
    },
    {
      name: 'Pipe Installation & Repair',
      slug: 'pipe-installation-repair',
      shortDescription: 'Professional pipe installation and repair services',
      description: 'Expert pipe installation and repair services for residential and commercial properties. We work with all types of piping materials including PVC, copper, PEX, and galvanized steel.',
      icon: 'GitBranch',
      price: 3000,
      priceType: 'quote',
      duration: '2-4 hours average',
      features: ['All pipe materials', 'Leak detection', 'Pipe replacement', 'Code compliance'],
      isPopular: true,
      isActive: true,
      displayOrder: 2,
    },
    {
      name: 'Water Heater Services',
      slug: 'water-heater-services',
      shortDescription: 'Installation, repair, and maintenance of water heaters',
      description: 'Complete water heater solutions including installation of new units, repairs, and routine maintenance. We service all major brands and types including tankless, solar, and traditional water heaters.',
      icon: 'Flame',
      price: 8000,
      priceType: 'quote',
      duration: '3-6 hours',
      features: ['All heater types', 'Tankless installation', 'Solar water heaters', 'Annual maintenance'],
      isPopular: false,
      isActive: true,
      displayOrder: 3,
    },
    {
      name: 'Drain Cleaning',
      slug: 'drain-cleaning',
      shortDescription: 'Professional drain cleaning and unclogging services',
      description: 'Professional drain cleaning services using modern equipment and techniques. We clear blocked drains, sewer lines, and prevent future clogs with thorough cleaning methods.',
      icon: 'Droplets',
      price: 2500,
      priceType: 'fixed',
      duration: '1-2 hours',
      features: ['Hydro jetting', 'Camera inspection', 'Rooter service', 'Preventive maintenance'],
      isPopular: false,
      isActive: true,
      displayOrder: 4,
    },
    {
      name: 'Bathroom Renovation',
      slug: 'bathroom-renovation',
      shortDescription: 'Complete bathroom renovation and remodeling',
      description: 'Transform your bathroom with our comprehensive renovation services. From fixture installation to complete remodels, we create beautiful, functional bathrooms.',
      icon: 'Bath',
      price: 150000,
      priceType: 'quote',
      duration: '1-3 weeks',
      features: ['Custom designs', 'Fixture installation', 'Tile work', 'Complete remodeling'],
      isPopular: false,
      isActive: true,
      displayOrder: 5,
    },
    {
      name: 'Kitchen Plumbing',
      slug: 'kitchen-plumbing',
      shortDescription: 'Kitchen plumbing installation and repair services',
      description: 'Complete kitchen plumbing services including sink installation, faucet repair, garbage disposal, and dishwasher connections. We ensure your kitchen plumbing works flawlessly.',
      icon: 'ChefHat',
      price: 5000,
      priceType: 'quote',
      duration: '2-4 hours',
      features: ['Sink installation', 'Faucet repair', 'Dishwasher hookup', 'Garbage disposal'],
      isPopular: false,
      isActive: true,
      displayOrder: 6,
    },
    {
      name: 'Sewer Line Services',
      slug: 'sewer-line-services',
      shortDescription: 'Sewer line inspection, repair, and replacement',
      description: 'Professional sewer line services including inspection, repair, and complete replacement. We use trenchless technology when possible to minimize disruption to your property.',
      icon: 'Route',
      price: 20000,
      priceType: 'quote',
      duration: '1-3 days',
      features: ['Video inspection', 'Trenchless repair', 'Line replacement', 'Root removal'],
      isPopular: false,
      isActive: true,
      displayOrder: 7,
    },
    {
      name: 'Water Treatment',
      slug: 'water-treatment',
      shortDescription: 'Water filtration and treatment system installation',
      description: 'Improve your water quality with our water treatment solutions. We install and maintain water softeners, filtration systems, and purification systems for clean, safe water.',
      icon: 'Filter',
      price: 25000,
      priceType: 'quote',
      duration: '4-8 hours',
      features: ['Water testing', 'Softener installation', 'Filtration systems', 'UV purification'],
      isPopular: false,
      isActive: true,
      displayOrder: 8,
    },
  ]

  for (const service of services) {
    const created = await prisma.service.upsert({
      where: { slug: service.slug },
      create: service,
      update: service,
    })
    console.log('Created service:', created.name)
  }

  // Create FAQs
  const faqs = [
    {
      question: 'What areas do you serve in Nairobi?',
      answer: 'We serve all areas within Nairobi County and its environs including Westlands, Karen, Lavington, Kilimani, Kileleshwa, Parklands, Eastleigh, and surrounding areas. For areas outside Nairobi, please contact us for availability.',
      category: 'General',
      displayOrder: 1,
    },
    {
      question: 'Do you offer emergency services?',
      answer: 'Yes, we offer 24/7 emergency plumbing services. For emergencies, call us directly at 0720 219802 for immediate assistance. Our emergency team is always ready to respond to urgent plumbing issues.',
      category: 'Services',
      displayOrder: 2,
    },
    {
      question: 'How do I request a quote for my project?',
      answer: 'You can request a free quote by filling out our online booking form, calling us at 0720 219802, or sending an email to info@climatetechplumbing.co.ke. We typically respond within 2 hours during business hours.',
      category: 'Booking',
      displayOrder: 3,
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including M-Pesa, bank transfers, credit/debit cards, and cash. For large projects, we offer flexible payment plans. Please discuss with our team for more details.',
      category: 'Payment',
      displayOrder: 4,
    },
    {
      question: 'Do you provide warranties for your work?',
      answer: 'Yes, all our work comes with a warranty. The duration varies depending on the type of service - typically 6 months to 2 years. We stand behind our work and will address any issues covered under warranty at no additional cost.',
      category: 'Warranty',
      displayOrder: 5,
    },
    {
      question: 'How quickly can you respond to a service call?',
      answer: 'For emergency calls, we aim to respond within 1-2 hours. For scheduled appointments, we offer same-day or next-day service depending on availability. We always strive to accommodate urgent requests.',
      category: 'Services',
      displayOrder: 6,
    },
  ]

  for (const faq of faqs) {
    const created = await prisma.faq.upsert({
      where: { id: faq.question.slice(0, 25) + Math.random().toString() },
      create: faq,
      update: faq,
    })
    console.log('Created FAQ:', faq.question.slice(0, 30) + '...')
  }

  // Create sample reviews
  const reviews = [
    {
      name: 'John Mwangi',
      email: 'john.m@example.com',
      rating: 5,
      title: 'Excellent Emergency Service',
      comment: 'Called them at 2 AM for a burst pipe emergency. They arrived within 45 minutes and fixed the issue professionally. Highly recommend their services!',
      isVerified: true,
      isApproved: true,
      isFeatured: true,
    },
    {
      name: 'Mary Wanjiku',
      email: 'mary.w@example.com',
      rating: 5,
      title: 'Great Bathroom Renovation',
      comment: 'Climate Tech Plumbing renovated our bathroom and the results exceeded our expectations. The team was professional, clean, and completed the work on time.',
      isVerified: true,
      isApproved: true,
      isFeatured: true,
    },
    {
      name: 'Peter Ochieng',
      email: 'peter.o@example.com',
      rating: 4,
      title: 'Reliable Service',
      comment: 'Have used their services twice for different plumbing issues. Both times they were punctual and fixed the problems efficiently. Good value for money.',
      isVerified: true,
      isApproved: true,
      isFeatured: false,
    },
    {
      name: 'Sarah Kimani',
      email: 'sarah.k@example.com',
      rating: 5,
      title: 'Professional Team',
      comment: 'The team installed a new water heater and did an excellent job. They were knowledgeable, explained the process, and left the area clean. Will definitely use again.',
      isVerified: true,
      isApproved: true,
      isFeatured: true,
    },
  ]

  for (const review of reviews) {
    const created = await prisma.review.create({
      data: review,
    })
    console.log('Created review from:', review.name)
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
