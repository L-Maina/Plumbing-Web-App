"use client";

import { useSite } from "@/contexts/site-context";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Clock, Wrench, Lock } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const { settings } = useSite();
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">{settings?.businessName || "Climate Tech"}</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Professional plumbing services in Nairobi, Kenya.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Clock className="h-4 w-4" />
              <span>{settings?.is24_7 ? "24/7 Emergency Service" : settings?.businessHours}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {["Home", "About", "Services", "Booking", "Contact"].map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} className="block text-gray-400 hover:text-emerald-400 text-sm">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Our Services</h4>
            <div className="space-y-2">
              {["Plumbing", "Borehole Drilling", "Water Heater", "Emergency Repairs", "Renovations"].map((service) => (
                <p key={service} className="text-gray-400 text-sm">{service}</p>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Phone className="h-4 w-4" />
                <a href={`tel:${settings?.phone?.replace(/\s/g, '')}`} className="hover:text-emerald-400">{settings?.phone}</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${settings?.email}`} className="hover:text-emerald-400">{settings?.email}</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>{settings?.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} {settings?.businessName}. All rights reserved.</p>
          <div className="flex gap-4">
            {settings?.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400"><Facebook className="h-5 w-5" /></a>}
            {settings?.twitter && <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400"><Twitter className="h-5 w-5" /></a>}
            {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400"><Instagram className="h-5 w-5" /></a>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-300 text-xs"
            onClick={() => setShowAdmin(!showAdmin)}
          >
            <Lock className="h-3 w-3 mr-1" />
            Admin
          </Button>
        </div>
      </div>
    </footer>
  );
}
