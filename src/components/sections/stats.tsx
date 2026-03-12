"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Briefcase, 
  Award, 
  Clock 
} from "lucide-react";

const stats = [
  {
    icon: Briefcase,
    number: "500+",
    label: "Projects Completed",
    description: "Successfully delivered projects",
  },
  {
    icon: Users,
    number: "32+",
    label: "Happy Clients",
    description: "Satisfied customers served",
  },
  {
    icon: Award,
    number: "9+",
    label: "Years Experience",
    description: "Professional expertise",
  },
  {
    icon: Clock,
    number: "24/7",
    label: "Support Available",
    description: "Emergency services",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-50" />
      
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-7 w-7 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                {stat.number}
              </div>
              <div className="text-sm font-semibold text-emerald-600 mb-1">
                {stat.label}
              </div>
              <p className="text-xs text-gray-500">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
