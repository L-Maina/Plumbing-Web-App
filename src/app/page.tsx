"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LiveChat } from "@/components/live-chat";
import { HeroSection } from "@/components/sections/hero";
import { StatsSection } from "@/components/sections/stats";
import { AboutSection } from "@/components/sections/about";
import { ServicesSection } from "@/components/sections/services";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us";
import { BookingSection } from "@/components/sections/booking";
import { ReviewsSection } from "@/components/sections/reviews";
import { FaqSection } from "@/components/sections/faq";
import { ContactSection } from "@/components/sections/contact";
import { NewsletterSection } from "@/components/sections/newsletter";

// Version 2.0 - Full rebuild

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <BookingSection />
        <ReviewsSection />
        <FaqSection />
        <ContactSection />
        <NewsletterSection />
      </main>

      <Footer />
      <LiveChat />
    </div>
  );
}

