"use client";

import { motion } from "framer-motion";
import { 
  Wrench, 
  Droplets, 
  Thermometer, 
  Bath,
  Zap,
  Hammer,
  Droplet,
  RefreshCw,
  Home,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const services = [
  {
    icon: Wrench,
    title: "Plumbing Installation",
    description: "Complete plumbing installation for new buildings and renovations. We install pipes, fixtures, and water systems with precision.",
    image: "/images/service-plumbing.png",
  },
  {
    icon: Droplets,
    title: "Pipe Repairs & Maintenance",
    description: "Expert pipe repair services for leaks, bursts, and blockages. We ensure your plumbing system runs smoothly.",
    image: "/images/service-drain.png",
  },
  {
    icon: Thermometer,
    title: "Water Heater Services",
    description: "Installation, repair, and maintenance of water heaters. Get hot water flowing reliably in your home or business.",
    image: "/images/service-heater.png",
  },
  {
    icon: Bath,
    title: "Bathroom Renovations",
    description: "Complete bathroom renovation services from design to completion. Transform your bathroom into a modern space.",
    image: "/images/service-renovation.png",
  },
  {
    icon: Zap,
    title: "Emergency Plumbing",
    description: "24/7 emergency plumbing services for urgent repairs. We respond quickly to minimize damage and restore function.",
    image: "/images/service-emergency.png",
  },
  {
    icon: Droplet,
    title: "Urinal Installation",
    description: "Professional urinal installation for commercial and public facilities. Efficient and hygienic solutions.",
    image: "/images/service-plumbing.png",
  },
  {
    icon: RefreshCw,
    title: "Flush Valve Services",
    description: "Installation and repair of flush valves for toilets and urinals. Ensure proper flushing and water efficiency.",
    image: "/images/service-drain.png",
  },
  {
    icon: Hammer,
    title: "Paving Slab Repairs",
    description: "Repair and replacement of damaged paving slabs. Restore your outdoor spaces to their original condition.",
    image: "/images/service-renovation.png",
  },
];

export function ServicesSection() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 mb-4">
            <Home className="h-4 w-4" />
            <span className="text-sm font-medium">Our Services</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Professional Plumbing Solutions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer a comprehensive range of plumbing services to meet all your residential 
            and commercial needs. Quality workmanship guaranteed on every project.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <service.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="h-6 w-6 text-white" />
            <h3 className="text-xl font-bold text-white">Additional Services</h3>
          </div>
          <p className="text-white/90 mb-4 max-w-2xl mx-auto">
            Cold water connections, waste outlet & trap installation, refurbishment, 
            and general renovations. We handle projects of all sizes.
          </p>
          <Button
            variant="outline"
            className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-emerald-600"
            onClick={() => scrollToSection("#booking")}
          >
            Request a Service
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
