"use client";

import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Star, 
  Quote,
  User,
  CheckCircle,
  Loader2,
  Plus
} from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  service?: string;
  createdAt: string;
}

const initialReviews: Review[] = [
  {
    id: "1",
    name: "Peter Mwangi",
    rating: 5,
    comment: "Excellent service! The team arrived on time and fixed our burst pipe quickly. Very professional and affordable. Highly recommend Climate Tech for any plumbing needs.",
    service: "Emergency Plumbing",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Mary Wanjiku",
    rating: 5,
    comment: "Had my bathroom renovated by Climate Tech. The work was outstanding! They were clean, efficient, and the finished result exceeded my expectations. Will use them again.",
    service: "Bathroom Renovations",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    name: "James Ochieng",
    rating: 5,
    comment: "Best plumbers in Nairobi! They installed a new water heater for us and did a fantastic job. Very knowledgeable and took time to explain everything.",
    service: "Water Heater Services",
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    name: "Grace Nyambura",
    rating: 4,
    comment: "Good service overall. The team was professional and the work was completed on time. Minor delay in getting materials but they kept me informed.",
    service: "Plumbing Installation",
    createdAt: "2023-12-20",
  },
  {
    id: "5",
    name: "David Kipchoge",
    rating: 5,
    comment: "Called them for an emergency at midnight and they were at my door within 30 minutes. Fixed the issue and even gave tips on prevention. Amazing service!",
    service: "Emergency Plumbing",
    createdAt: "2023-12-15",
  },
];

const services = [
  "Plumbing Installation",
  "Pipe Repairs",
  "Water Heater Services",
  "Bathroom Renovations",
  "Emergency Plumbing",
  "General Maintenance",
];

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [formData, setFormData] = useState({
    name: "",
    service: "",
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      const data = await response.json();
      if (data.length > 0) {
        // Merge with initial reviews
        const dbReviews = data.map((r: Review) => ({
          ...r,
          createdAt: new Date(r.createdAt).toISOString().split("T")[0],
        }));
        setReviews([...dbReviews, ...initialReviews.filter(ir => !dbReviews.find((dr: Review) => dr.id === ir.id))]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rating,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newReview = {
          ...data.review,
          createdAt: new Date(data.review.createdAt).toISOString().split("T")[0],
        };
        setReviews([newReview, ...reviews]);
        setIsOpen(false);
        setFormData({ name: "", service: "", comment: "" });
        setRating(5);
      }
    } catch (error) {
      console.error("Review error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-2 mb-4">
            <Star className="h-4 w-4 fill-emerald-500" />
            <span className="text-sm font-medium">Customer Reviews</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i <= Math.round(averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
            <span className="text-gray-500">({reviews.length} reviews)</span>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.slice(0, 6).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-6 relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-emerald-100" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {review.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{review.service}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-4">{review.createdAt}</p>
            </motion.div>
          ))}
        </div>

        {/* Add Review Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
                <Plus className="h-4 w-4" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Share Your Experience</DialogTitle>
                <DialogDescription>
                  Help others by sharing your experience with our services.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Your Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-10"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Service Received</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => setFormData({ ...formData, service: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 transition-colors ${
                            i <= rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Your Review</Label>
                  <Textarea
                    placeholder="Share your experience..."
                    className="min-h-[100px]"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Submit Review
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </section>
  );
}
