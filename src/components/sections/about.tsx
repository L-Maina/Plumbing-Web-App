"use client";

import { useSite } from "@/contexts/site-context";
import { CheckCircle, Users, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";

export function AboutSection() {
  const { settings } = useSite();

  const stats = [
    { icon: Users, value: "500+", label: "Happy Clients" },
    { icon: Award, value: "10+", label: "Years Experience" },
    { icon: Clock, value: "24/7", label: "Support Available" },
    { icon: CheckCircle, value: "100%", label: "Satisfaction Rate" },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 mb-4 text-sm font-medium">
              About Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {settings?.aboutTitle || "About Climate Tech Plumbing"}
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {settings?.aboutContent || "We are a professional plumbing company dedicated to providing high-quality services."}
            </p>
            <div className="space-y-3">
              {["Licensed & Insured Professionals", "Quality Guaranteed Workmanship", "Transparent Pricing", "Emergency Services Available"].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <stat.icon className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
