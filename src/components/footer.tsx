"use client";

import Link from "next/link";
import { 
  Wrench, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Twitter,
  ArrowUp,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminDashboard } from "@/components/admin-dashboard";

const services = [
  "Plumbing Installation",
  "Pipe Repairs",
  "Bathroom Renovation",
  "Water Heater Services",
  "Drain Cleaning",
  "Emergency Plumbing",
];

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "About Us", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Reviews", href: "#reviews" },
  { name: "Contact", href: "#contact" },
  { name: "Book Now", href: "#booking" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Climate Tech</h3>
                <p className="text-sm text-emerald-400">Plumbing & Renovators</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Nairobi&apos;s trusted plumbing experts since 2015. Professional, reliable, and available 24/7 for all your plumbing needs.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-gray-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-gray-400 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Thika Rd, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <a href="tel:0720219802" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  0720 219802
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <a href="mailto:info@climate-tech.co.ke" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                  info@climate-tech.co.ke
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Available 24/7</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Climate Tech Plumbing & Renovators. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                <span>in Nairobi, Kenya</span>
              </div>
              <AdminDashboard />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <Button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg z-40"
        size="icon"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
}
