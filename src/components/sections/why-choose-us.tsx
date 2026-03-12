"use client";

import { motion } from "framer-motion";
import { 
  Shield, 
  Clock, 
  ThumbsUp, 
  DollarSign,
  Wrench,
  HeadphonesIcon
} from "lucide-react";

const reasons = [
  {
    icon: Shield,
    title: "Licensed & Insured",
    description: "All our plumbers are fully licensed, certified, and insured for your peace of mind.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Plumbing emergencies don't wait, and neither do we. Available around the clock.",
  },
  {
    icon: ThumbsUp,
    title: "Quality Guaranteed",
    description: "We stand behind our work with comprehensive warranties and satisfaction guarantee.",
  },
  {
    icon: DollarSign,
    title: "Fair Pricing",
    description: "Transparent, competitive pricing with no hidden fees. Free quotes on all jobs.",
  },
  {
    icon: Wrench,
    title: "Expert Technicians",
    description: "Our team has years of experience handling all types of plumbing challenges.",
  },
  {
    icon: HeadphonesIcon,
    title: "Excellent Support",
    description: "Friendly customer service and after-care support for all our clients.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 mb-4">
            <ThumbsUp className="h-4 w-4" />
            <span className="text-sm font-medium">Why Choose Us</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Nairobi Trusts Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            With nearly a decade of experience, we&apos;ve built our reputation on quality, 
            reliability, and customer satisfaction.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
                <reason.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {reason.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Trusted by 32+ Happy Customers
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join our growing list of satisfied customers across Nairobi. Experience the 
            Climate Tech difference today.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">4.9</div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">500+</div>
              <div className="text-gray-400 text-sm">Projects Done</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">9+</div>
              <div className="text-gray-400 text-sm">Years Experience</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
