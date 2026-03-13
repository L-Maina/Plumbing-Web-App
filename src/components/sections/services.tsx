"use client";

import { useSite } from "@/contexts/site-context";
import { Wrench, Droplets, Thermometer, Bath, Zap, Droplet, RefreshCw, Hammer, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench, Droplets, Thermometer, Bath, Zap, Droplet, RefreshCw, Hammer,
};

export function ServicesSection() {
  const { services } = useSite();
  const displayServices = services.filter(s => s.active);

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 mb-4">
            <Wrench className="h-4 w-4" /> Our Services
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Professional Plumbing Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive plumbing solutions for residential and commercial properties across Nairobi</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayServices.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Wrench;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all group cursor-pointer"
                onClick={() => document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" })}
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
                  <IconComponent className="h-7 w-7 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button onClick={() => document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" })} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6">
            <Phone className="mr-2 h-5 w-5" /> Book a Service Today
          </Button>
        </div>
      </div>
    </section>
  );
}
