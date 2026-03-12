"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  Loader2,
  CheckCircle,
  Bell
} from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setEmail("");
      }
    } catch (error) {
      console.error("Newsletter error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
            <Bell className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Newsletter</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated with Plumbing Tips
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for helpful plumbing tips, maintenance advice, 
            and exclusive offers. We promise not to spam your inbox!
          </p>

          {isSuccess ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
              <CheckCircle className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                You&apos;re Subscribed!
              </h3>
              <p className="text-white/90">
                Thank you for subscribing. You&apos;ll receive our latest tips and offers.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-12 bg-white border-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="h-12 bg-gray-900 hover:bg-gray-800 text-white px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          )}

          <p className="text-white/70 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
