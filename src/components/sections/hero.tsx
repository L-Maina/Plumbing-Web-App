"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Calendar, 
  Clock, 
  Shield, 
  Star,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import Image from "next/image";

interface SiteSettings {
  businessName: string;
  phone: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string | null;
}

export function HeroSection() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

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

    // Listen for settings updates from admin
    const handleSettingsUpdate = () => {
      fetchSettings();
    };
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const businessName = settings?.businessName || "Climate Tech Plumbing & Renovators";
  const heroTitle = settings?.heroTitle || "Professional Plumbing & Borehole Services";
  const heroSubtitle = settings?.heroSubtitle || "Expert solutions for all your plumbing, borehole drilling, and water system needs in Nairobi & Kenya";
  const phoneNumber = settings?.phone || "0720 219802";

  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.png"
          alt="Professional plumbing services in Nairobi"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 md:py-40">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-2 mb-6"
          >
            <Clock className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">Available 24/7 for Emergency Services</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            {heroTitle.split(' ').slice(0, 2).join(' ')}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              {heroTitle.split(' ').slice(2).join(' ') || "Plumbing Services"}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl"
          >
            {heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
              onClick={() => scrollToSection("#booking")}
            >
              <Calendar className="h-5 w-5" />
              Book a Service
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-emerald-600 gap-2"
              onClick={() => scrollToSection("#contact")}
            >
              <Phone className="h-5 w-5" />
              Contact Us
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white flex items-center justify-center"
                  >
                    <span className="text-xs text-white font-medium">{i}</span>
                  </div>
                ))}
              </div>
              <div className="text-white">
                <span className="font-bold">32+</span>
                <span className="text-gray-300 text-sm ml-1">Happy Clients</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <span className="font-bold">4.9</span>
              <span className="text-gray-300 text-sm">(32 Reviews)</span>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16"
        >
          {[
            {
              icon: Clock,
              title: "24/7 Emergency",
              description: "Round-the-clock emergency plumbing services",
            },
            {
              icon: Shield,
              title: "Licensed & Insured",
              description: "Fully certified plumbing professionals",
            },
            {
              icon: CheckCircle,
              title: "Satisfaction Guaranteed",
              description: "Quality workmanship on every job",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300"
            >
              <feature.icon className="h-8 w-8 text-emerald-400 mb-4" />
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-2 bg-white rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
