"use client";

import { useState, useEffect } from "react";
import { useSite, generateTimeSlots, formatTimeSlot } from "@/contexts/site-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Mail, Phone, MapPin, CheckCircle, Loader2 } from "lucide-react";

export function BookingSection() {
  const { settings, services } = useSite();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isClosed, setIsClosed] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", service: "", otherDescription: "", date: "", time: "", address: "", notes: ""
  });

  const activeServices = services.filter(s => s.active);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (formData.date) {
      const slots = generateTimeSlots(settings, formData.date);
      setAvailableSlots(slots);
      setIsClosed(slots.length === 0 && !settings?.is24_7);
      if (formData.time && !slots.includes(formData.time)) {
        setFormData(prev => ({ ...prev, time: "" }));
      }
    }
  }, [formData.date, settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", phone: "", service: "", otherDescription: "", date: "", time: "", address: "", notes: "" });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 mb-4">
            <Calendar className="h-4 w-4" /> Book a Service
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Schedule Your Appointment</h2>
          <p className="text-gray-600">{settings?.is24_7 ? "24/7 booking available" : "Book during our working hours"}</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {isSuccess ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted!</h3>
              <p className="text-gray-600 mb-4">We'll contact you shortly to confirm.</p>
              <Button onClick={() => setIsSuccess(false)} variant="outline">Book Another</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 rounded-2xl p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="pl-10" placeholder="John Doe" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="pl-10" placeholder={settings?.phone} />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pl-10" placeholder="email@example.com" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Service *</label>
                <Select value={formData.service} onValueChange={(v) => setFormData({ ...formData, service: v })}>
                  <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                  <SelectContent>
                    {activeServices.map(s => <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>)}
                    <SelectItem value="Other">Other (describe below)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.service === "Other" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Describe Your Service Need *</label>
                  <Textarea required value={formData.otherDescription} onChange={(e) => setFormData({ ...formData, otherDescription: e.target.value })} placeholder="Please describe..." />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date *</label>
                  <Input required type="date" min={today} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Time *</label>
                  <Select value={formData.time} onValueChange={(v) => setFormData({ ...formData, time: v })} disabled={!formData.date || isClosed}>
                    <SelectTrigger>
                      <SelectValue placeholder={isClosed ? "Closed" : "Select time"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.map(slot => <SelectItem key={slot} value={slot}>{formatTimeSlot(slot)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Address *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="pl-10" placeholder="Your address" />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting || isClosed} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6">
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : <><Calendar className="mr-2 h-4 w-4" /> Book Now</>}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
