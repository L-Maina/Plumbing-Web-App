"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useSite } from "@/contexts/site-context";
import { Phone, Menu, Wrench, Clock, MessageCircle, Home, Info, Briefcase, Mail as MailIcon, Calendar, Star } from "lucide-react";

const navItems = [
  { name: "Home", href: "#home", icon: Home },
  { name: "About", href: "#about", icon: Info },
  { name: "Services", href: "#services", icon: Briefcase },
  { name: "Reviews", href: "#reviews", icon: Star },
  { name: "Contact", href: "#contact", icon: MailIcon },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useSite();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const businessName = settings?.businessName || "Climate Tech";
  const phone = settings?.phone || "0720 219802";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all ${isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"}`}>
      <div className="px-4 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("#home"); }} className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900">{businessName}</span>
              <span className="text-xs text-gray-500 hidden sm:block">Plumbing & Renovators</span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a key={item.name} href={item.href} onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-emerald-500 text-emerald-600" onClick={() => scrollToSection("#booking")}>
              <Calendar className="h-4 w-4 mr-1" /> Book Now
            </Button>
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => scrollToSection("#contact")}>
              <Phone className="h-4 w-4 mr-1" /> Call Us
            </Button>
          </div>

          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100">
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex flex-col h-full bg-white">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold">{businessName}</p>
                  <p className="text-xs text-emerald-100">Plumbing & Renovators</p>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-emerald-50 border-b">
              <div className="flex items-center gap-2 text-sm text-emerald-700">
                <Clock className="h-4 w-4" />
                <span>{settings?.is24_7 ? "24/7 Emergency" : settings?.businessHours || "Open"}</span>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto">
              {navItems.map((item) => (
                <a key={item.name} href={item.href} onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                  className="flex items-center gap-3 px-4 py-3.5 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 font-medium border-l-4 border-transparent hover:border-emerald-500">
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              ))}
            </nav>
            <div className="p-4 border-t bg-gray-50 space-y-3">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => scrollToSection("#booking")}>
                <Calendar className="h-5 w-5 mr-2" /> Book a Service
              </Button>
              <a href={"tel:" + phone.replace(/\s/g, '')} className="flex items-center justify-center gap-2 text-emerald-600 font-semibold py-3">
                <Phone className="h-5 w-5" /> Call: {phone}
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
