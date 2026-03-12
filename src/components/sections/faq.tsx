"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What areas do you serve in Nairobi?",
    answer: "We serve the entire Nairobi metropolitan area including Thika Road, Westlands, Karen, Kilimani, Eastleigh, Kiambu, and surrounding areas. If you're unsure whether we cover your location, give us a call and we'll confirm.",
  },
  {
    question: "Do you offer emergency plumbing services?",
    answer: "Yes! We provide 24/7 emergency plumbing services. For urgent issues like burst pipes, severe leaks, or blocked drains, call us immediately at 0720 219802 and we'll dispatch a team as quickly as possible.",
  },
  {
    question: "How do I book a plumbing service?",
    answer: "You can book a service through our online booking form on this website, call us directly at 0720 219802, or send us an email at info@climate-tech.co.ke. We'll confirm your appointment and provide a time estimate.",
  },
  {
    question: "What are your payment methods?",
    answer: "We accept cash, M-Pesa, bank transfers, and major credit/debit cards. Payment is typically due upon completion of the work, though larger projects may require a deposit.",
  },
  {
    question: "Do you provide warranties on your work?",
    answer: "Yes, we stand behind our work. All our installations and repairs come with a warranty. The duration varies depending on the type of work - we'll provide specific warranty details before starting any project.",
  },
  {
    question: "How much do your services cost?",
    answer: "Our pricing is competitive and transparent. We provide free quotes after assessing the work needed. Costs depend on the complexity of the job, materials required, and time involved. We always discuss pricing before starting work.",
  },
  {
    question: "Are your plumbers licensed and insured?",
    answer: "Absolutely. All our plumbers are fully licensed, trained, and insured. We take pride in our professional standards and ensure our team is up-to-date with the latest plumbing techniques and safety protocols.",
  },
  {
    question: "Can you handle commercial plumbing projects?",
    answer: "Yes, we handle both residential and commercial plumbing projects. From small office repairs to large-scale commercial installations, we have the expertise and equipment to handle projects of any size.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 mb-4">
            <HelpCircle className="h-4 w-4" />
            <span className="text-sm font-medium">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Find answers to common questions about our plumbing services.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-gray-50 rounded-lg px-6 border-0"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-emerald-600 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
