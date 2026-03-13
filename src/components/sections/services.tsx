"use client";

import { useState, useEffect } from "react";
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

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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
};

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string | null;
  active: boolean;
  order: number;
}

const defaultServices: Service[] = [
  {
    id: "default-1",
    title: "Plumbing Installation",
    description: "Complete plumbing installation for new buildings and renovations. We install pipes, fixtures, and water systems with precision.",
    icon: "Wrench",
    image: "/images/service-plumbing.png",
    active: true,
    order: 0
  },
  {
    id: "default-2",
    title: "Pipe Repairs & Maintenance",
    description: "Expert pipe repair services for leaks, bursts, and blockages. We ensure your plumbing system runs smoothly.",
    icon: "Droplets",
    image: "/images/service-drain.png",
    active: true,
    order: 1
  },
  {
    id: "default-3",
    title: "Water Heater Services",
    description: "Installation, repair, and maintenance of water heaters. Get hot water flowing reliably in your home or business.",
    icon: "Thermometer",
    image: "/images/service-heater.png",
    active: true,
    order: 2
  },
  {
    id: "default-4",
    title: "Bathroom Renovation",
    description: "Complete bathroom renovation services. From design to installation, we transform your bathroom into a modern space.",
    icon: "Bath",
    image: "/images/service-renovation.png",
    active: true,
    order: 3
  },
  {
    id: "default-5",
    title: "Emergency Plumbing",
    description: "24/7 emergency plumbing services. We're always available for urgent plumbing issues. Call us anytime.",
    icon: "AlertTriangle",
    image: "/images/service-emergency.png",
    active: true,
    order: 4
  }
];

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");
        if (response.ok) {
          const data = await response.json();
          // Filter to only active services
          const activeServices = data.filter((s: Service) => s.active);
          if (activeServices.length > 0) {
            setServices(activeServices);
          } else {
            setServices(defaultServices);
          }
        } else {
          setServices(defaultServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Use default images for services without images
  const getServiceImage = (service: Service, index: number) => {
    if (service.image) return service.image;
    const defaultImages = [
      "/images/service-plumbing.png",
      "/images/service-drain.png",
      "/images/service-heater.png",
      "/images/service-renovation.png",
      "/images/service-emergency.png"
    ];
    return defaultImages[index % defaultImages.length];
  };

  // Get the icon component
  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Wrench;
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">What We Offer</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Our Services</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Professional plumbing services for residential and commercial properties in Nairobi and across Kenya.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = getIcon(service.icon);
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={getServiceImage(service, index)}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

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
            and general renovations. We handle projects of any size.
          </p>
          <Button 
            className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-8"
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Book a Service
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
