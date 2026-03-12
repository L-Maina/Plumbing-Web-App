"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Loader2
} from "lucide-react";

const services = [
  "Plumbing Installation",
  "Pipe Repairs & Maintenance",
  "Water Heater Services",
  "Bathroom Renovations",
  "Emergency Plumbing",
  "Urinal Installation",
  "Flush Valve Services",
  "Paving Slab Repairs",
  "Cold Water Connections",
  "Waste Outlet & Trap Installation",
  "General Renovations",
];

const timeSlots = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export function BookingSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    address: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          date: "",
          time: "",
          address: "",
          notes: "",
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="booking" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 mb-4">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">Book a Service</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Schedule Your Plumbing Service
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Book your appointment online and our team will contact you to confirm. 
            We offer flexible scheduling to suit your needs.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-500" />
                  Booking Form
                </CardTitle>
                <CardDescription>
                  Fill in your details and we&apos;ll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Booking Submitted!
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Thank you for your booking. We will contact you shortly to confirm your appointment.
                    </p>
                    <Button
                      onClick={() => setIsSuccess(false)}
                      variant="outline"
                      className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                    >
                      Make Another Booking
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="name"
                            placeholder="John Kamau"
                            className="pl-10"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            placeholder="0720 219802"
                            className="pl-10"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service">Service Required *</Label>
                      <Select
                        value={formData.service}
                        onValueChange={(value) => setFormData({ ...formData, service: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Preferred Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          min={today}
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Preferred Time *</Label>
                        <Select
                          value={formData.time}
                          onValueChange={(value) => setFormData({ ...formData, time: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Service Address *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Textarea
                          id="address"
                          placeholder="Enter your full address in Nairobi..."
                          className="pl-10 min-h-[80px]"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any specific requirements or details about the job..."
                        className="min-h-[80px]"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Appointment
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="border-0 shadow-lg bg-emerald-500 text-white">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 mb-4" />
                <h3 className="font-semibold text-lg mb-2">24/7 Emergency</h3>
                <p className="text-white/90 text-sm mb-4">
                  For emergency plumbing issues, call us directly anytime.
                </p>
                <a href="tel:0720219802" className="text-xl font-bold">
                  0720 219802
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">What to Expect</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Confirmation call within 2 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Free on-site assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Transparent pricing quote</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>Professional service delivery</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gray-900 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Service Areas</h3>
                <p className="text-gray-300 text-sm mb-3">
                  We serve all areas along Thika Road and greater Nairobi region.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Thika Rd", "Westlands", "Karen", "Kilimani", "Eastleigh", "Kiambu"].map((area) => (
                    <span key={area} className="bg-white/10 rounded-full px-3 py-1 text-xs">
                      {area}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
