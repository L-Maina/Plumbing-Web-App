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
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Reviews", href: "#reviews" },
  { name: "Contact", href: "#contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

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
            <div className="flex items-center gap-6">
              <a href="tel:0720219802" className="flex items-center gap-2 hover:text-emerald-200 transition-colors">
                <Phone className="h-4 w-4" />
                <span>0720 219802</span>
              </a>
              <div className="hidden sm:flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Available 24/7</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-emerald-200 transition-colors"
              >
                Facebook
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-emerald-200 transition-colors"
              >
                X (Twitter)
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
                Climate Tech
              </span>
              <span className={`text-xs font-medium transition-colors ${
                isScrolled ? "text-emerald-600" : "text-emerald-300"
              }`}>
                Plumbing & Renovators
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                className={`font-medium transition-colors hover:text-emerald-500 ${
                  isScrolled ? "text-gray-700" : "text-white"
                }`}
              >
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
                    <span className="font-bold text-gray-900">Climate Tech</span>
                    <span className="text-xs text-emerald-600">Plumbing & Renovators</span>
                  </div>
                </div>

                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.href);
                      }}
                      className="text-lg font-medium text-gray-700 hover:text-emerald-500 transition-colors py-2"
                    >
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
                    href="tel:0720219802"
                    className="flex items-center justify-center gap-2 text-emerald-600 font-medium"
                  >
                    <Phone className="h-4 w-4" />
                    0720 219802
                  </a>
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Available 24/7</span>
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
