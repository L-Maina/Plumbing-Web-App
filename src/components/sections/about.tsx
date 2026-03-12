"use client";

import { motion } from "framer-motion";
import { 
  Award, 
  CheckCircle
} from "lucide-react";
import Image from "next/image";

const stats = [
  { number: "9+", label: "Years Experience" },
  { number: "500+", label: "Projects Completed" },
  { number: "32+", label: "Happy Clients" },
  { number: "24/7", label: "Support Available" },
];

const values = [
  "Professional & Reliable Service",
  "Competitive & Transparent Pricing",
  "Quality Workmanship Guaranteed",
  "Timely Project Completion",
  "Customer Satisfaction Focus",
  "Fully Licensed & Insured",
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/about-story.png"
                alt="Climate Tech Plumbing team"
                width={600}
                height={400}
                className="object-cover w-full h-[400px]"
              />
            </div>
            {/* Stats Overlay */}
            <div className="absolute -bottom-6 -right-6 bg-emerald-500 text-white rounded-xl p-6 shadow-xl">
              <div className="text-center">
                <span className="text-4xl font-bold">9+</span>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 mb-4">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">About Us</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nairobi&apos;s Trusted Plumbing Experts Since 2015
            </h2>

            <p className="text-gray-600 mb-6">
              Climate Tech Plumbing and Renovators has been serving Nairobi and its environs 
              with exceptional plumbing services for nearly a decade. Our team of skilled 
              professionals is dedicated to providing top-notch plumbing installation, repairs, 
              and renovation services.
            </p>

            <p className="text-gray-600 mb-8">
              We take pride in our commitment to quality, professionalism, and customer satisfaction. 
              Whether you need emergency repairs, routine maintenance, or complete bathroom renovations, 
              our experienced team is ready to deliver outstanding results.
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {values.map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{value}</span>
                </div>
              ))}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <span className="text-2xl font-bold text-emerald-600">{stat.number}</span>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Meet Our Professional Team
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our skilled plumbers and technicians are trained to handle all your plumbing needs 
              with expertise and professionalism.
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/team.png"
              alt="Climate Tech Plumbing team"
              width={1200}
              height={500}
              className="object-cover w-full h-[300px] md:h-[400px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-3xl">
                <h4 className="text-2xl font-bold text-white mb-2">
                  Expert Team, Quality Service
                </h4>
                <p className="text-gray-200">
                  Our team brings together years of experience and continuous training to deliver 
                  exceptional plumbing services across Nairobi.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
