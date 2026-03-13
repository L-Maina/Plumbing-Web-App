"use client";

import { useSite } from "@/contexts/site-context";
import { Button } from "@/components/ui/button";
import { Phone, Clock, ChevronRight, Wrench } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  const { settings, services } = useSite();

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-gray-50 to-emerald-50 pt-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 text-sm font-medium">
              <Wrench className="h-4 w-4" /> Professional Plumbing Services
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {settings?.heroTitle || "Professional Plumbing & Borehole Services"}
            </h1>

            <p className="text-lg text-gray-600 max-w-xl">
              {settings?.heroSubtitle || "Expert solutions for all your plumbing needs in Nairobi"}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button onClick={() => document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" })} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg">
                Book Now <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })} className="border-2 border-emerald-500 text-emerald-600 px-8 py-6 text-lg">
                Contact Us
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-5 w-5 text-emerald-500" />
                <a href={`tel:${settings?.phone?.replace(/\s/g, '')}`} className="font-semibold hover:text-emerald-600">
                  {settings?.phone || "0720 219802"}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-5 w-5 text-emerald-500" />
                <span>{settings?.is24_7 ? "24/7 Available" : settings?.businessHours}</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
            <div className="relative">
              <div className="w-full h-[500px] bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center">
                <Wrench className="h-40 w-40 text-white/30" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6">
                <p className="text-3xl font-bold text-emerald-500">10+</p>
                <p className="text-gray-600 text-sm">Years Experience</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
