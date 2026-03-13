"use client";

import { SiteProvider } from "@/contexts/site-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LiveChat } from "@/components/live-chat";
import { HeroSection } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services";
import { AboutSection } from "@/components/sections/about";
import { BookingSection } from "@/components/sections/booking";

export default function Home() {
  return (
    <SiteProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <ServicesSection />
          <AboutSection />
          <BookingSection />
        </main>
        <Footer />
        <LiveChat />
      </div>
    </SiteProvider>
  );
}
