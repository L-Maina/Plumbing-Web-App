"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; 
import { 
  Phone, 
  Menu, 
  X, 
  Wrench, 
  Clock, 
  MessageCircle,
  ChevronDown,
  Facebook,
  Instagram,
  Home,
  Users,
  Star,
  Mail
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SiteSettings {
  businessName: string;
  phone: string;
  phone2: string | null;
  email: string;
  address: string;
  businessHours: string;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  whatsapp: string | null;
}

const navItems = [
  { name: "Home", href: "#home", icon: Home },
  { name: "About", href: "#about", icon: Users },
  { name: "Services", href: "#services", icon: Wrench },
  { name: "Reviews", href: "#reviews", icon: Star },
  { name: "Contact", href: "#contact", icon: Mail },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const phoneNumber = settings?.phone || "0720 219802";
  const whatsappNumber = settings?.whatsapp || "254720219802";
  const facebookUrl = settings?.facebook || "https://facebook.com";
  const twitterUrl = settings?.twitter || "https://twitter.com";
  const instagramUrl = settings?.instagram || "https://instagram.com";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      {/* Top Bar */}
      <div className={`transition-all duration-300 overflow-hidden ${
        isScrolled ? "h-0" : "h-auto"
      }`}>
        <div className="bg-emerald-700 text-white py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 md:gap-6">
              <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-emerald-200 transition-colors">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">{phoneNumber}</span>
              </a>
              <div className="hidden sm:flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{settings?.businessHours || "Available 24/7"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              {/* WhatsApp */}
              <a 
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-emerald-200 transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden md:inline">WhatsApp</span>
              </a>
              {/* Instagram */}
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-emerald-200 transition-colors"
                title="Follow on Instagram"
              >
                <Instagram className="h-4 w-4" />
                <span className="hidden md:inline">Instagram</span>
              </a>
              {/* Facebook */}
              <a 
                href={facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-emerald-200 transition-colors"
                title="Follow on Facebook"
              >
                <Facebook className="h-4 w-4" />
                <span className="hidden md:inline">Facebook</span>
              </a>
              {/* X (Twitter) */}
              <a 
                href={twitterUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-emerald-200 transition-colors"
                title="Follow on X"
              >
                <span className="font-bold text-sm">𝕏</span>
                <span className="hidden md:inline">X</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" onClick={() => scrollToSection("#home")} className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-[8px] text-white font-bold">24</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-lg leading-tight transition-colors ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}>
                {settings?.businessName?.split(' ').slice(0, 2).join(' ') || "Climate Tech"}
              </span>
              <span className={`text-xs font-medium transition-colors ${
                isScrolled ? "text-emerald-600" : "text-emerald-300"
              }`}>
                {settings?.businessName?.split(' ').slice(2).join(' ') || "Plumbing & Renovators"}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                className={`flex items-center gap-2 font-medium transition-colors hover:text-emerald-500 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="outline"
              className={`border-2 ${
                isScrolled 
                  ? "border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700" 
                  : "border-white bg-transparent text-white hover:bg-white hover:text-emerald-600"
              }`}
              onClick={() => scrollToSection("#booking")}
            >
              Book Now
            </Button>
            <Button 
              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
              onClick={() => scrollToSection("#contact")}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Us
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className={isScrolled ? "text-gray-900" : "text-white"}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{settings?.businessName?.split(' ').slice(0, 2).join(' ') || "Climate Tech"}</span>
                    <span className="text-xs text-emerald-600">{settings?.businessName?.split(' ').slice(2).join(' ') || "Plumbing & Renovators"}</span>
                  </div>
                </div>

                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.href);
                      }}
                      className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-emerald-500 transition-colors py-3 px-2 rounded-lg hover:bg-emerald-50"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </a>
                  ))}
                </nav>

                <div className="mt-auto space-y-4 pt-8 border-t">
                  <Button 
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => scrollToSection("#booking")}
                  >
                    Book a Service
                  </Button>
                  <a 
                    href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                    className="flex items-center justify-center gap-2 text-emerald-600 font-medium"
                  >
                    <Phone className="h-4 w-4" />
                    {phoneNumber}
                  </a>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{settings?.businessHours || "Available 24/7"}</span>
                  </div>
                  {/* Social Links in Mobile Menu */}
                  <div className="flex items-center justify-center gap-4 pt-4">
                    <a 
                      href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </a>
                    <a 
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a 
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a 
                      href={twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-900 transition-colors"
                    >
                      <span className="font-bold text-lg">𝕏</span>
                    </a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
