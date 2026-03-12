"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Calendar,
  Mail,
  Phone,
  Clock,
  Trash2,
  CheckCircle,
  Loader2,
  RefreshCw,
  Lock,
  KeyRound,
  Bell,
  X,
  Send,
  User,
  Star,
  Shield,
  Users,
  MessageCircle,
  Wrench,
  ChevronRight,
  MapPin,
  Eye,
  EyeOff,
  AlertTriangle,
  Check,
  Settings,
  Menu,
  Building,
  MailOpen,
  MapPinned,
  ClockIcon,
  Type,
  FileText,
  Image,
  Facebook,
  Twitter,
  Instagram,
  Globe,
  Upload,
  PhoneCall
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  address: string;
  notes: string | null;
  status: string;
  createdAt: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface Newsletter {
  id: string;
  email: string;
  createdAt: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  service: string | null;
  createdAt: string;
}

interface ChatSession {
  id: string;
  customerName: string | null;
  handoffRequested: boolean;
  needsHuman: boolean;
  takenOver: boolean;
  finished: boolean;
  messages: { id: string; sender: string; message: string; createdAt: string }[];
  createdAt: string;
}

interface Stats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  totalContacts: number;
  newContacts: number;
  totalSubscribers: number;
  totalReviews: number;
}

interface AdminData {
  bookings: Booking[];
  contacts: Contact[];
  newsletters: Newsletter[];
  reviews: Review[];
  stats: Stats;
}

interface SiteSettings {
  id: string;
  businessName: string;
  phone: string;
  phone2: string | null;
  email: string;
  address: string;
  businessHours: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string | null;
  aboutTitle: string;
  aboutContent: string;
  aboutImage: string | null;
  logoUrl: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  whatsapp: string | null;
}

type PageType = "dashboard" | "bookings" | "messages" | "livechat" | "subscribers" | "reviews" | "settings";

const ADMIN_PASSWORD = "climate2024";

export function AdminDashboard() {
  // Auth state
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  
  // Data state
  const [data, setData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sendingNotification, setSendingNotification] = useState<string | null>(null);
  const [notificationResult, setNotificationResult] = useState<{
    booking: string;
    email?: string;
    sms?: string;
  } | null>(null);
  
  // Navigation
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");
  
  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Live Chat state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [acceptingHandoff, setAcceptingHandoff] = useState<string | null>(null);
  const [showChatAlert, setShowChatAlert] = useState(false);
  const [prevPendingCount, setPrevPendingCount] = useState(0);
  
  // Settings state
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setIsAuthenticated(false);
      setPassword("");
      setPasswordError("");
      setData(null);
      setNotificationResult(null);
      setCurrentPage("dashboard");
      setActiveSession(null);
      setShowPassword(false);
      setChatSessions([]);
      setSidebarOpen(false);
      setSettings(null);
    }
  }, [isOpen]);

  // Fetch chat sessions
  const fetchChatSessions = async () => {
    try {
      const response = await fetch("/api/chat/sessions");
      if (response.ok) {
        const sessions = await response.json();
        
        // Check for new handoff requests (alert)
        const newPendingCount = sessions.filter((s: ChatSession) => s.handoffRequested && !s.takenOver).length;
        if (newPendingCount > prevPendingCount && prevPendingCount >= 0) {
          setShowChatAlert(true);
          // Auto-hide alert after 5 seconds
          setTimeout(() => setShowChatAlert(false), 5000);
        }
        setPrevPendingCount(newPendingCount);
        
        setChatSessions(sessions);
        
        // Update active session if it exists
        if (activeSession) {
          const updatedSession = sessions.find((s: ChatSession) => s.id === activeSession.id);
          if (updatedSession) {
            setActiveSession(updatedSession);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
    }
  };

  // Auto-refresh chat sessions when on livechat page
  useEffect(() => {
    if (isAuthenticated && currentPage === "livechat") {
      setPrevPendingCount(-1); // Reset to detect first load
      fetchChatSessions();
      const interval = setInterval(fetchChatSessions, 3000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, currentPage]);
  
  // Also poll for new chats when admin is logged in (even on other pages)
  useEffect(() => {
    if (isAuthenticated && currentPage !== "livechat") {
      const interval = setInterval(fetchChatSessions, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, currentPage]);

  // Actions
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
      fetchData();
      fetchChatSessions();
      fetchSettings();
    } else {
      setPasswordError("Incorrect password");
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const result = await response.json();
      setSettings(result);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  // Mark all contacts as read when messages page is opened
  const markContactsAsRead = async () => {
    try {
      await fetch("/api/contacts/mark-read", { method: "POST" });
      fetchData(); // Refresh data to update badges
    } catch (error) {
      console.error("Error marking contacts as read:", error);
    }
  };

  // Mark chat handoffs as viewed when live chat page is opened
  const markChatsAsViewed = async () => {
    try {
      await fetch("/api/chat/mark-viewed", { method: "POST" });
      fetchChatSessions(); // Refresh sessions
    } catch (error) {
      console.error("Error marking chats as viewed:", error);
    }
  };

  // Finish a chat conversation
  const finishConversation = async (sessionId: string) => {
    if (!confirm("Are you sure you want to end this conversation? The customer will no longer be able to send messages.")) return;
    try {
      await fetch("/api/chat/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      setActiveSession(null);
      fetchChatSessions();
    } catch (error) {
      console.error("Error finishing conversation:", error);
    }
  };

  // Upload image
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const result = await response.json();
      if (result.success) {
        return result.url;
      }
      return null;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Handle image file selection
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof SiteSettings) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    setUploadingImage(field);
    const url = await uploadImage(file);
    if (url) {
      setSettings({ ...settings, [field]: url });
    }
    setUploadingImage(null);
  };

  // Track when current page changes
  useEffect(() => {
    if (isAuthenticated) {
      if (currentPage === "messages") {
        markContactsAsRead();
      } else if (currentPage === "livechat") {
        markChatsAsViewed();
      }
    }
  }, [currentPage, isAuthenticated]);

  const saveSettings = async () => {
    if (!settings) return;
    setSavingSettings(true);
    setSettingsSaved(false);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const result = await response.json();
      if (result.success) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSavingSettings(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "booking", id, status }),
      });
      fetchData();
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", id, status }),
      });
      fetchData();
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const deleteRecord = async (type: string, id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    
    try {
      await fetch(`/api/admin?type=${type}&id=${id}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const sendNotification = async (bookingId: string, type: 'email' | 'sms' | 'both') => {
    setSendingNotification(bookingId);
    try {
      // First update booking status to confirmed
      await updateBookingStatus(bookingId, "confirmed");
      
      // Then notify customer via SMS and/or Email
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "booking_confirmed", 
          data: { bookingId }
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotificationResult({
          booking: bookingId,
          email: result.email?.success ? "Email sent successfully!" : "Email failed",
          sms: result.sms?.success ? "SMS sent successfully!" : "SMS failed",
        });
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    } finally {
      setSendingNotification(null);
    }
  };

  const acceptHandoff = async (sessionId: string) => {
    setAcceptingHandoff(sessionId);
    try {
      const response = await fetch("/api/chat/accept-handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("Handoff accepted:", result);
        
        // Refresh sessions and update active session
        const sessionsResponse = await fetch("/api/chat/sessions");
        if (sessionsResponse.ok) {
          const sessions = await sessionsResponse.json();
          setChatSessions(sessions);
          
          // Find and update the active session
          const updatedSession = sessions.find((s: ChatSession) => s.id === sessionId);
          if (updatedSession) {
            setActiveSession(updatedSession);
          }
        }
      }
    } catch (error) {
      console.error("Error accepting handoff:", error);
    } finally {
      setAcceptingHandoff(null);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !activeSession) return;
    
    const messageToSend = chatInput;
    setChatInput(""); // Clear input immediately for better UX
    
    try {
      const response = await fetch("/api/chat/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSession.id,
          message: messageToSend,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Update active session immediately with the response
        if (result.session) {
          setActiveSession(result.session);
          
          // Also update in the sessions list
          setChatSessions(prev => 
            prev.map(s => s.id === result.session.id ? result.session : s)
          );
        } else {
          // Fallback to fetching all sessions
          await fetchChatSessions();
        }
      }
    } catch (error) {
      console.error("Error sending chat message:", error);
      // Restore the message on error
      setChatInput(messageToSend);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "new":
        return "bg-amber-500";
      case "confirmed":
      case "read":
        return "bg-blue-500";
      case "completed":
      case "responded":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Navigation items
  const navItems = [
    { id: "dashboard" as PageType, label: "Dashboard", icon: Shield },
    { id: "bookings" as PageType, label: "Bookings", icon: Calendar, count: data?.bookings.filter(b => b.status === "pending").length },
    { id: "messages" as PageType, label: "Messages", icon: Mail, count: data?.contacts.filter(c => c.status === "new").length },
    { id: "livechat" as PageType, label: "Live Chat", icon: MessageCircle, count: chatSessions.filter(s => s.handoffRequested && !s.takenOver && !s.finished).length },
    { id: "subscribers" as PageType, label: "Subscribers", icon: Users, count: data?.newsletters.length },
    { id: "reviews" as PageType, label: "Reviews", icon: Star, count: data?.reviews.length },
    { id: "settings" as PageType, label: "Settings", icon: Settings },
  ];

  // Sidebar Navigation Component
  const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-gray-700">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <KeyRound className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white">Admin Panel</h2>
            <p className="text-xs md:text-sm text-gray-400">Climate Tech</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentPage(item.id);
              if (item.id === "livechat") fetchChatSessions();
              setSidebarOpen(false);
              onNavigate?.();
            }}
            className={`w-full flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3 md:py-4 rounded-xl text-left transition-all ${
              currentPage === item.id
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 font-medium text-sm md:text-base">{item.label}</span>
            {item.count !== undefined && item.count > 0 && (
              <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                {item.count}
              </Badge>
            )}
          </button>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-3 md:p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 md:py-4 bg-gray-700/30 rounded-xl">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-white text-sm md:text-base">Administrator</p>
            <p className="text-xs md:text-sm text-gray-400">Full Access</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setIsOpen(true)}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-300 text-xs group"
        >
          <Lock className="h-3 w-3 mr-1 group-hover:text-emerald-500 transition-colors" />
          Admin
        </Button>
      </motion.div>

      {/* Full Screen Modal - No Dialog component */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="absolute inset-0 bg-white overflow-hidden flex flex-col"
            >
              <AnimatePresence mode="wait">
                {!isAuthenticated ? (
                  <motion.div 
                    key="login"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center flex-1 bg-gradient-to-br from-gray-50 to-gray-100"
                  >
                    {/* Close Button - Login Screen */}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors z-50"
                    >
                      <X className="h-5 w-5 md:h-6 md:w-6 text-gray-700" />
                    </button>

                    {/* Login Form */}
                    <div className="w-full max-w-lg p-6 md:p-12">
                      <motion.div 
                        className="text-center mb-8 md:mb-10"
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="inline-block mb-6 md:mb-8"
                        >
                          <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                            <Shield className="h-10 w-10 md:h-14 md:w-14 text-white" />
                          </div>
                        </motion.div>
                        
                        <motion.h2 
                          className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          Admin Portal
                        </motion.h2>
                        
                        <motion.p 
                          className="text-gray-500 text-base md:text-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          Climate Tech Plumbing Management
                        </motion.p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                      >
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                            className="h-12 md:h-14 text-lg md:text-xl text-center tracking-wider border-2 border-gray-300 focus:border-emerald-500 transition-colors pr-14 text-gray-900 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5 text-gray-700" /> : <Eye className="h-5 w-5 text-gray-700" />}
                          </button>
                        </div>

                        <AnimatePresence>
                          {passwordError && (
                            <motion.p 
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-red-500 text-center bg-red-50 py-3 rounded-lg text-sm md:text-base"
                            >
                              ❌ {passwordError}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        <Button 
                          onClick={handleLogin} 
                          disabled={password.length === 0}
                          className="w-full h-12 md:h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-lg md:text-xl font-medium shadow-lg shadow-emerald-500/30 transition-all"
                        >
                          <Lock className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                          Access Dashboard
                        </Button>
                      </motion.div>

                      <motion.p 
                        className="text-xs md:text-sm text-center text-gray-400 mt-6 md:mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        💡 Demo password: climate2024
                      </motion.p>
                    </div>
                  </motion.div>
                ) : isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center flex-1"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="h-16 w-16 md:h-20 md:w-20 text-emerald-500" />
                    </motion.div>
                    <motion.p 
                      className="mt-4 md:mt-6 text-gray-500 text-lg md:text-xl"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Loading dashboard...
                    </motion.p>
                  </motion.div>
                ) : data ? (
                  <motion.div 
                    key="dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-1 overflow-hidden"
                  >
                    {/* Desktop Sidebar - Hidden on mobile */}
                    <div className="hidden md:flex w-72 bg-gradient-to-b from-gray-900 to-gray-800 flex-col flex-shrink-0">
                      <SidebarNav />
                    </div>

                    {/* Mobile Sidebar - Sheet overlay */}
                    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                      <SheetContent side="left" className="w-72 p-0 bg-gradient-to-b from-gray-900 to-gray-800 border-r-0 z-[10000]">
                        <SheetHeader className="sr-only">
                          <SheetTitle>Navigation Menu</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col h-full">
                          <SidebarNav onNavigate={() => setSidebarOpen(false)} />
                        </div>
                      </SheetContent>
                    </Sheet>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                      {/* Header */}
                      <header className="h-14 md:h-16 border-b bg-white flex items-center justify-between px-3 md:px-8 flex-shrink-0 shadow-sm">
                        <div className="flex items-center gap-2 md:gap-0">
                          {/* Mobile hamburger menu */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="md:hidden p-2"
                            onClick={() => setSidebarOpen(true)}
                          >
                            <Menu className="h-5 w-5 text-gray-700" />
                          </Button>
                          <h1 className="text-lg md:text-2xl font-bold text-gray-800 truncate">
                            {navItems.find(n => n.id === currentPage)?.label || "Dashboard"}
                          </h1>
                        </div>
                        <div className="flex items-center gap-1 md:gap-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => { fetchData(); fetchChatSessions(); }}
                            className="hidden md:flex items-center gap-2 bg-white border-gray-300 hover:bg-gray-100 text-gray-700"
                          >
                            <RefreshCw className="h-4 w-4" />
                            Refresh
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => { fetchData(); fetchChatSessions(); }}
                            className="md:hidden p-2"
                          >
                            <RefreshCw className="h-4 w-4 text-gray-700" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-1 md:gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-2 md:px-4"
                          >
                            <X className="h-4 w-4" />
                            <span className="hidden md:inline">Close</span>
                          </Button>
                        </div>
                      </header>

                      {/* New Chat Alert Banner */}
                      <AnimatePresence>
                        {showChatAlert && chatSessions.filter(s => s.handoffRequested && !s.takenOver).length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white overflow-hidden flex-shrink-0"
                          >
                            <div className="px-4 md:px-8 py-3 md:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3 md:gap-4">
                                <Bell className="h-5 w-5 md:h-6 md:w-6 animate-pulse" />
                                <div>
                                  <p className="font-bold text-base md:text-lg">
                                    🔔 New Customer Needs Help!
                                  </p>
                                  <p className="text-amber-100 text-sm md:text-base">
                                    {chatSessions.filter(s => s.handoffRequested && !s.takenOver).length} customer(s) waiting
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setShowChatAlert(false);
                                  setCurrentPage("livechat");
                                }}
                                className="bg-white text-amber-600 hover:bg-amber-50 font-medium text-sm md:text-base"
                              >
                                Go to Live Chat
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Content - Fixed scrolling for mobile */}
                      <div className="flex-1 overflow-y-auto">
                        <div className="p-4 md:p-8 pb-20 md:pb-8">
                          {/* DASHBOARD PAGE */}
                          {currentPage === "dashboard" && (
                            <div className="space-y-6 md:space-y-8">
                              {/* Welcome Banner */}
                              <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl md:rounded-2xl p-4 md:p-8 text-white">
                                <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Welcome back, Admin! 👋</h2>
                                <p className="text-emerald-100 text-sm md:text-lg">Here&apos;s what&apos;s happening with your business today.</p>
                              </div>

                              {/* Stats Grid */}
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                                {[
                                  { label: "Total Bookings", value: data.stats.totalBookings, icon: Calendar },
                                  { label: "Messages", value: data.stats.totalContacts, icon: Mail },
                                  { label: "Subscribers", value: data.stats.totalSubscribers, icon: Users },
                                  { label: "Reviews", value: data.stats.totalReviews, icon: Star },
                                ].map((stat) => (
                                  <div key={stat.label} className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 border shadow-sm">
                                    <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-emerald-500 mb-2 md:mb-4" />
                                    <p className="text-2xl md:text-4xl font-bold text-gray-800">{stat.value}</p>
                                    <p className="text-xs md:text-sm text-gray-500 mt-1">{stat.label}</p>
                                  </div>
                                ))}
                              </div>

                              {/* Quick Actions */}
                              <div>
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                  {navItems.slice(1, -1).map((item) => (
                                    <button
                                      key={item.id}
                                      onClick={() => setCurrentPage(item.id)}
                                      className="flex items-center gap-3 md:gap-4 p-4 md:p-6 bg-white rounded-lg md:rounded-xl border hover:shadow-md transition-shadow text-left"
                                    >
                                      <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                                        <item.icon className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
                                      </div>
                                      <span className="font-medium text-sm md:text-base text-gray-700">{item.label}</span>
                                      <ChevronRight className="h-5 w-5 text-gray-400 ml-auto hidden md:block" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* BOOKINGS PAGE */}
                          {currentPage === "bookings" && (
                            <div className="space-y-4 md:space-y-6">
                              {data.bookings.length === 0 ? (
                                <div className="text-center py-12 md:py-16">
                                  <Calendar className="h-16 w-16 md:h-20 md:w-20 mx-auto text-gray-300 mb-4" />
                                  <h3 className="text-lg md:text-xl font-medium text-gray-600">No bookings yet</h3>
                                </div>
                              ) : (
                                <div className="grid gap-4 md:gap-6">
                                  {data.bookings.map((booking) => (
                                    <div key={booking.id} className="bg-white rounded-lg md:rounded-xl border p-4 md:p-6 shadow-sm">
                                      <div className="flex flex-wrap items-start justify-between gap-3 md:gap-4 mb-3 md:mb-4">
                                        <div className="flex items-center gap-3 md:gap-4">
                                          <div className="w-10 h-10 md:w-14 md:h-14 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="h-5 w-5 md:h-7 md:w-7 text-emerald-600" />
                                          </div>
                                          <div className="min-w-0">
                                            <h4 className="text-lg md:text-xl font-semibold text-gray-800 truncate">{booking.name}</h4>
                                            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-gray-500 text-xs md:text-sm mt-1">
                                              <span className="flex items-center gap-1">
                                                <Phone className="h-3 w-3 md:h-4 md:w-4" />
                                                {booking.phone}
                                              </span>
                                              <span className="flex items-center gap-1 truncate">
                                                <Mail className="h-3 w-3 md:h-4 md:w-4" />
                                                <span className="truncate">{booking.email}</span>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <Badge className={`${getStatusColor(booking.status)} text-white px-3 md:px-4 py-1 text-xs md:text-sm`}>
                                          {booking.status}
                                        </Badge>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 mb-3 md:mb-4 text-gray-600 text-sm md:text-base">
                                        <div className="flex items-center gap-2">
                                          <Wrench className="h-4 w-4 md:h-5 md:w-5 text-emerald-500 flex-shrink-0" />
                                          <span className="truncate">{booking.service}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4 md:h-5 md:w-5 text-blue-500 flex-shrink-0" />
                                          <span>{booking.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Clock className="h-4 w-4 md:h-5 md:w-5 text-purple-500 flex-shrink-0" />
                                          <span>{booking.time}</span>
                                        </div>
                                      </div>

                                      <div className="flex items-start gap-2 text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                                        <MapPin className="h-4 w-4 md:h-5 md:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <span>{booking.address}</span>
                                      </div>

                                      {booking.notes && (
                                        <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                                          <p className="text-gray-600 text-sm md:text-base"><strong>Notes:</strong> {booking.notes}</p>
                                        </div>
                                      )}

                                      <div className="flex flex-wrap items-center gap-2 md:gap-3 pt-3 md:pt-4 border-t">
                                        <span className="text-xs md:text-sm text-gray-400">
                                          {new Date(booking.createdAt).toLocaleString()}
                                        </span>
                                        <div className="flex-1" />
                                        
                                        {booking.status === 'pending' && (
                                          <Button
                                            size="sm"
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm"
                                            disabled={sendingNotification === booking.id}
                                            onClick={() => sendNotification(booking.id, 'both')}
                                          >
                                            {sendingNotification === booking.id ? (
                                              <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 animate-spin" />
                                            ) : (
                                              <Bell className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                            )}
                                            <span className="hidden sm:inline">Confirm & Notify</span>
                                            <span className="sm:hidden">Confirm</span>
                                          </Button>
                                        )}
                                        
                                        {booking.status !== 'completed' && (
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => updateBookingStatus(booking.id, "completed")}
                                            className="text-gray-700 border-gray-300 hover:bg-gray-100 text-xs md:text-sm"
                                          >
                                            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                            <span className="hidden sm:inline">Complete</span>
                                          </Button>
                                        )}
                                        
                                        <Button variant="outline" size="sm" onClick={() => deleteRecord("booking", booking.id)} className="text-red-600 p-2 md:px-4">
                                          <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* MESSAGES PAGE */}
                          {currentPage === "messages" && (
                            <div className="space-y-4 md:space-y-6">
                              {data.contacts.length === 0 ? (
                                <div className="text-center py-12 md:py-16">
                                  <Mail className="h-16 w-16 md:h-20 md:w-20 mx-auto text-gray-300 mb-4" />
                                  <h3 className="text-lg md:text-xl font-medium text-gray-600">No messages yet</h3>
                                </div>
                              ) : (
                                <div className="grid gap-4 md:gap-6">
                                  {data.contacts.map((contact) => (
                                    <div key={contact.id} className="bg-white rounded-lg md:rounded-xl border p-4 md:p-6 shadow-sm">
                                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3 md:mb-4">
                                        <div className="flex items-center gap-3 md:gap-4">
                                          <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Mail className="h-5 w-5 md:h-7 md:w-7 text-blue-600" />
                                          </div>
                                          <div className="min-w-0">
                                            <h4 className="text-lg md:text-xl font-semibold text-gray-800">{contact.name}</h4>
                                            <p className="text-gray-500 text-sm md:text-base truncate">{contact.email}</p>
                                          </div>
                                        </div>
                                        <Badge className={getStatusColor(contact.status)}>{contact.status}</Badge>
                                      </div>
                                      
                                      <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                                        <p className="font-medium text-gray-700 text-base md:text-lg mb-2">{contact.subject}</p>
                                        <p className="text-gray-600 text-sm md:text-base">{contact.message}</p>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                        <span className="text-xs md:text-sm text-gray-400">
                                          {new Date(contact.createdAt).toLocaleString()}
                                        </span>
                                        <div className="flex-1" />
                                        <Button variant="outline" size="sm" onClick={() => updateContactStatus(contact.id, "read")} className="text-xs md:text-sm">
                                          <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                          Read
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => deleteRecord("contact", contact.id)} className="text-red-600 p-2 md:px-4">
                                          <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* LIVE CHAT PAGE - WhatsApp Style */}
                          {currentPage === "livechat" && (
                            <div className="h-[calc(100vh-160px)] md:h-[calc(100vh-180px)] min-h-[400px] md:min-h-[500px]">
                              <div className="flex h-full border rounded-lg md:rounded-xl overflow-hidden bg-white shadow-lg">
                                {/* Sessions List - Left Panel */}
                                <div className="w-full sm:w-[280px] md:w-[320px] border-r flex flex-col flex-shrink-0 bg-white">
                                  {/* Header */}
                                  <div className="p-3 md:p-4 border-b bg-gray-50">
                                    <div className="flex items-center justify-between">
                                      <h3 className="font-bold text-base md:text-lg text-gray-800">Chats</h3>
                                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs md:text-sm">
                                        {chatSessions.length} active
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  {/* Session List */}
                                  <div className="flex-1 overflow-y-auto">
                                    {chatSessions.length === 0 ? (
                                      <div className="p-4 md:p-6 text-center text-gray-500">
                                        <MessageCircle className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 md:mb-3 text-gray-300" />
                                        <p className="font-medium text-sm md:text-base">No chats yet</p>
                                        <p className="text-xs md:text-sm text-gray-400 mt-1">Customer conversations will appear here</p>
                                      </div>
                                    ) : (
                                      <div>
                                        {chatSessions.map((session) => {
                                          const lastMsg = session.messages[session.messages.length - 1];
                                          const isSelected = activeSession?.id === session.id;
                                          const needsAttention = session.handoffRequested && !session.takenOver;
                                          
                                          return (
                                            <button
                                              key={session.id}
                                              onClick={() => setActiveSession(session)}
                                              className={`w-full p-3 md:p-4 text-left transition-all border-l-4 ${
                                                isSelected 
                                                  ? "bg-emerald-50 border-l-emerald-500" 
                                                  : needsAttention
                                                    ? "bg-amber-50 border-l-amber-500 hover:bg-amber-100"
                                                    : "border-l-transparent hover:bg-gray-50"
                                              }`}
                                            >
                                              {/* Customer Info Row */}
                                              <div className="flex items-center gap-2 md:gap-3 mb-2">
                                                {/* Avatar */}
                                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                  needsAttention ? "bg-amber-100" : "bg-emerald-100"
                                                }`}>
                                                  <User className={`h-5 w-5 md:h-6 md:w-6 ${needsAttention ? "text-amber-600" : "text-emerald-600"}`} />
                                                </div>
                                                
                                                {/* Name and Time */}
                                                <div className="flex-1 min-w-0">
                                                  <div className="flex items-center justify-between">
                                                    <span className={`font-semibold truncate text-sm md:text-base ${
                                                      needsAttention ? "text-amber-800" : "text-gray-900"
                                                    }`}>
                                                      {session.customerName || "Guest"}
                                                    </span>
                                                    <span className="text-[10px] md:text-xs text-gray-400 flex-shrink-0 ml-2">
                                                      {new Date(session.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                    </span>
                                                  </div>
                                                  
                                                  {/* Status badges */}
                                                  <div className="flex items-center gap-1 md:gap-2 mt-1 flex-wrap">
                                                    {session.takenOver && (
                                                      <Badge className="bg-green-500 text-white text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5">
                                                        Active
                                                      </Badge>
                                                    )}
                                                    {needsAttention && (
                                                      <Badge className="bg-amber-500 text-white text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 animate-pulse">
                                                        Needs Response
                                                      </Badge>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                              
                                              {/* Last Message Preview */}
                                              <p className="text-xs md:text-sm text-gray-500 truncate ml-10 md:ml-12">
                                                {lastMsg?.message || "No messages yet"}
                                              </p>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Chat Area - Right Panel - Hidden on mobile unless active session */}
                                <div className={`flex-1 flex-col bg-[#efeae2] ${activeSession ? 'flex' : 'hidden sm:flex'}`} style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23d4cfc4\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}>
                                  {/* Mobile back button */}
                                  {activeSession && (
                                    <div className="sm:hidden p-2 bg-gray-100 border-b flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setActiveSession(null)}
                                        className="p-2"
                                      >
                                        <ChevronRight className="h-5 w-5 rotate-180" />
                                      </Button>
                                      <span className="font-medium">{activeSession.customerName || "Guest"}</span>
                                    </div>
                                  )}
                                  
                                  {activeSession ? (
                                    <>
                                      {/* Chat Header - Hidden on mobile (shown in back button row) */}
                                      <div className="hidden sm:flex p-3 bg-gray-100 border-b items-center justify-between flex-shrink-0">
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-white" />
                                          </div>
                                          <div>
                                            <h4 className="font-bold text-gray-900">{activeSession.customerName || "Guest"}</h4>
                                            <div className="flex items-center gap-1 text-xs">
                                              {activeSession.takenOver ? (
                                                <span className="text-green-600 font-medium">● You are assisting</span>
                                              ) : activeSession.needsHuman ? (
                                                <span className="text-blue-600 font-medium">● Ready to respond</span>
                                              ) : activeSession.handoffRequested ? (
                                                <span className="text-amber-600 font-medium flex items-center gap-1">
                                                  <AlertTriangle className="h-3 w-3" /> Waiting for acceptance
                                                </span>
                                              ) : (
                                                <span className="text-gray-500">● AI Assistant handling</span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {/* Accept Handoff Button */}
                                        {activeSession.handoffRequested && !activeSession.takenOver && !activeSession.needsHuman && (
                                          <Button
                                            size="sm"
                                            onClick={() => acceptHandoff(activeSession.id)}
                                            disabled={acceptingHandoff === activeSession.id}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs md:text-sm"
                                          >
                                            {acceptingHandoff === activeSession.id ? (
                                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                              <Check className="h-4 w-4 mr-2" />
                                            )}
                                            Accept & Respond
                                          </Button>
                                        )}
                                      </div>

                                      {/* Messages - WhatsApp Style */}
                                      <div 
                                        ref={(el) => {
                                          if (el) {
                                            el.scrollTop = el.scrollHeight;
                                          }
                                        }}
                                        className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2"
                                        style={{ maxHeight: "calc(100% - 140px)" }}
                                      >
                                        {activeSession.messages.length === 0 ? (
                                          <div className="text-center text-gray-500 py-6 md:py-8">
                                            <MessageCircle className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-2 text-gray-300" />
                                            <p className="text-sm md:text-base">No messages yet</p>
                                          </div>
                                        ) : (
                                          activeSession.messages.map((msg) => (
                                            <div
                                              key={msg.id}
                                              className={`flex ${msg.sender === "support" ? "justify-end" : "justify-start"}`}
                                            >
                                              <div
                                                className={`max-w-[85%] md:max-w-[75%] rounded-lg px-3 py-2 shadow-sm relative ${
                                                  msg.sender === "support"
                                                    ? "bg-[#d9fdd3] text-gray-800"
                                                    : msg.sender === "user"
                                                    ? "bg-white text-gray-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }`}
                                              >
                                                {/* Sender Name */}
                                                {msg.sender !== "support" && msg.sender !== "user" && (
                                                  <p className="text-[10px] font-bold text-emerald-600 mb-1">
                                                    {msg.sender === "bot" ? "🤖 AI Assistant" : msg.sender}
                                                  </p>
                                                )}
                                                {msg.sender === "user" && (
                                                  <p className="text-[10px] font-bold text-blue-600 mb-1">
                                                    {activeSession.customerName || "Customer"}
                                                  </p>
                                                )}
                                                {msg.sender === "support" && (
                                                  <p className="text-[10px] font-bold text-purple-600 mb-1">
                                                    💼 You (Support)
                                                  </p>
                                                )}
                                                
                                                {/* Message Content */}
                                                <p className="text-xs md:text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                                
                                                {/* Time */}
                                                <div className="flex items-center justify-end gap-1 mt-1">
                                                  <span className="text-[10px] text-gray-400">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                  </span>
                                                  {msg.sender === "support" && (
                                                    <span className="text-[10px] text-blue-500">✓✓</span>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          ))
                                        )}
                                      </div>

                                      {/* Input Area - WhatsApp Style */}
                                      <div className="p-2 md:p-3 bg-gray-100 border-t flex-shrink-0">
                                        {(activeSession.takenOver || activeSession.needsHuman) && !activeSession.finished ? (
                                          <div className="space-y-2">
                                            <div className="flex gap-2 items-center">
                                              <Input
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                                                placeholder="Type a message..."
                                                className="flex-1 bg-white rounded-full px-4 py-2 text-gray-800 border-0 focus-visible:ring-2 focus-visible:ring-emerald-500 text-sm md:text-base"
                                              />
                                              <Button
                                                onClick={sendChatMessage}
                                                disabled={!chatInput.trim()}
                                                className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 p-0"
                                              >
                                                <Send className="h-5 w-5 text-white" />
                                              </Button>
                                            </div>
                                            {/* Finish Conversation Button */}
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => finishConversation(activeSession.id)}
                                              className="w-full text-red-600 border-red-200 hover:bg-red-50 text-xs md:text-sm"
                                            >
                                              <PhoneCall className="h-4 w-4 mr-2" />
                                              End Conversation
                                            </Button>
                                          </div>
                                        ) : activeSession.finished ? (
                                          <div className="text-center py-2">
                                            <p className="text-xs md:text-sm text-gray-500">
                                              ✅ This conversation has been ended
                                            </p>
                                          </div>
                                        ) : (
                                          <div className="text-center py-2">
                                            <p className="text-xs md:text-sm text-gray-500">
                                              {activeSession.handoffRequested 
                                                ? "👆 Accept the handoff to start responding" 
                                                : "🤖 AI is handling this conversation"}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex-1 hidden sm:flex items-center justify-center text-gray-500">
                                      <div className="text-center">
                                        <MessageCircle className="h-16 w-16 md:h-20 md:w-20 mx-auto mb-4 text-gray-300" />
                                        <p className="text-lg md:text-xl font-medium">Select a conversation</p>
                                        <p className="text-xs md:text-sm text-gray-400 mt-1">Choose a chat from the list to view messages</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* SUBSCRIBERS PAGE */}
                          {currentPage === "subscribers" && (
                            <div className="space-y-4 md:space-y-6">
                              {data.newsletters.length === 0 ? (
                                <div className="text-center py-12 md:py-16">
                                  <Users className="h-16 w-16 md:h-20 md:w-20 mx-auto text-gray-300 mb-4" />
                                  <h3 className="text-lg md:text-xl font-medium text-gray-600">No subscribers yet</h3>
                                </div>
                              ) : (
                                <div className="bg-white rounded-lg md:rounded-xl border shadow-sm overflow-hidden">
                                  <div className="overflow-x-auto">
                                    <table className="w-full min-w-[500px]">
                                      <thead className="bg-gray-50 border-b">
                                        <tr>
                                          <th className="text-left p-3 md:p-4 font-medium text-gray-600 text-sm md:text-base">Email</th>
                                          <th className="text-left p-3 md:p-4 font-medium text-gray-600 text-sm md:text-base">Subscribed At</th>
                                          <th className="text-left p-3 md:p-4 font-medium text-gray-600 text-sm md:text-base">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y">
                                        {data.newsletters.map((newsletter) => (
                                          <tr key={newsletter.id} className="hover:bg-gray-50">
                                            <td className="p-3 md:p-4 text-sm md:text-base">{newsletter.email}</td>
                                            <td className="p-3 md:p-4 text-gray-500 text-sm md:text-base">
                                              {new Date(newsletter.createdAt).toLocaleString()}
                                            </td>
                                            <td className="p-3 md:p-4">
                                              <Button variant="outline" size="sm" onClick={() => deleteRecord("newsletter", newsletter.id)} className="text-red-600 p-2 md:px-4">
                                                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                                              </Button>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* REVIEWS PAGE */}
                          {currentPage === "reviews" && (
                            <div className="space-y-4 md:space-y-6">
                              {data.reviews.length === 0 ? (
                                <div className="text-center py-12 md:py-16">
                                  <Star className="h-16 w-16 md:h-20 md:w-20 mx-auto text-gray-300 mb-4" />
                                  <h3 className="text-lg md:text-xl font-medium text-gray-600">No reviews yet</h3>
                                </div>
                              ) : (
                                <div className="grid gap-4 md:gap-6">
                                  {data.reviews.map((review) => (
                                    <div key={review.id} className="bg-white rounded-lg md:rounded-xl border p-4 md:p-6 shadow-sm">
                                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3 md:mb-4">
                                        <div>
                                          <h4 className="text-base md:text-lg font-semibold text-gray-800">{review.name}</h4>
                                          <div className="flex items-center gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                              <Star
                                                key={i}
                                                className={`h-3 w-3 md:h-4 md:w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                        <span className="text-xs md:text-sm text-gray-400">
                                          {new Date(review.createdAt).toLocaleString()}
                                        </span>
                                      </div>
                                      <p className="text-gray-600 text-sm md:text-base">{review.comment}</p>
                                      {review.service && (
                                        <p className="text-xs md:text-sm text-gray-400 mt-2">Service: {review.service}</p>
                                      )}
                                      <div className="flex justify-end mt-3 md:mt-4">
                                        <Button variant="outline" size="sm" onClick={() => deleteRecord("review", review.id)} className="text-red-600 text-xs md:text-sm">
                                          <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* SETTINGS PAGE */}
                          {currentPage === "settings" && (
                            <div className="space-y-4 md:space-y-6">
                              {/* Header */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
                                <div>
                                  <h2 className="text-lg md:text-2xl font-bold text-gray-800">Site Settings</h2>
                                  <p className="text-gray-500 text-xs md:text-base">Manage your business info, images & social links</p>
                                </div>
                                {settingsSaved && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 md:px-4 py-2 rounded-lg"
                                  >
                                    <Check className="h-4 w-4 md:h-5 md:w-5" />
                                    <span className="font-medium text-sm md:text-base">Saved!</span>
                                  </motion.div>
                                )}
                              </div>

                              {settings ? (
                                <div className="grid gap-4 md:gap-6">
                                  {/* Business Information */}
                                  <div className="bg-white rounded-lg md:rounded-xl border p-3 md:p-5 shadow-sm">
                                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-5">
                                      <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <Building className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
                                      </div>
                                      <h3 className="text-base md:text-lg font-semibold text-gray-800">Business Information</h3>
                                    </div>
                                    <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                                      <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Business Name</label>
                                        <Input
                                          value={settings.businessName}
                                          onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                                          placeholder="Your business name"
                                          className="text-sm md:text-base h-9 md:h-10"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Primary Phone</label>
                                        <div className="relative">
                                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                          <Input
                                            value={settings.phone}
                                            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                            placeholder="0720 219802"
                                            className="pl-10 text-sm md:text-base h-9 md:h-10"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Secondary Phone (Optional)</label>
                                        <div className="relative">
                                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                          <Input
                                            value={settings.phone2 || ""}
                                            onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
                                            placeholder="07XX XXX XXX"
                                            className="pl-10 text-sm md:text-base h-9 md:h-10"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Email Address</label>
                                        <div className="relative">
                                          <MailOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                          <Input
                                            value={settings.email}
                                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                            placeholder="info@example.com"
                                            type="email"
                                            className="pl-10 text-sm md:text-base h-9 md:h-10"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Business Hours</label>
                                        <div className="relative">
                                          <ClockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                          <Input
                                            value={settings.businessHours}
                                            onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                                            placeholder="24/7 Emergency Services"
                                            className="pl-10 text-sm md:text-base h-9 md:h-10"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">WhatsApp Number</label>
                                        <div className="relative">
                                          <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                          <Input
                                            value={settings.whatsapp || ""}
                                            onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                            placeholder="254720219802"
                                            className="pl-10 text-sm md:text-base h-9 md:h-10"
                                          />
                                        </div>
                                      </div>
                                      <div className="md:col-span-2">
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Address / Location</label>
                                        <div className="relative">
                                          <MapPinned className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                          <Textarea
                                            value={settings.address}
                                            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                            placeholder="Thika Rd, Nairobi, Kenya"
                                            rows={2}
                                            className="pl-10 text-sm md:text-base"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Social Media Links */}
                                  <div className="bg-white rounded-lg md:rounded-xl border p-3 md:p-5 shadow-sm">
                                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-5">
                                      <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Globe className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                                      </div>
                                      <h3 className="text-base md:text-lg font-semibold text-gray-800">Social Media</h3>
                                    </div>
                                    <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                                      <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Facebook URL</label>
                                        <div className="relative">
                                          <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                          <Input
                                            value={settings.facebook || ""}
                                            onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                                            placeholder="https://facebook.com/yourpage"
                                            className="pl-10 text-sm md:text-base h-9 md:h-10"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Twitter/X URL</label>
                                        <div className="relative">
                                          <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                          <Input
                                            value={settings.twitter || ""}
                                            onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                                            placeholder="https://twitter.com/yourhandle"
                                            className="pl-10 text-sm md:text-base h-9 md:h-10"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Instagram URL</label>
                                        <div className="relative">
                                          <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                          <Input
                                            value={settings.instagram || ""}
                                            onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                            placeholder="https://instagram.com/yourhandle"
                                            className="pl-10 text-sm md:text-base h-9 md:h-10"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Hero Section */}
                                  <div className="bg-white rounded-lg md:rounded-xl border p-3 md:p-5 shadow-sm">
                                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-5">
                                      <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Type className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                                      </div>
                                      <h3 className="text-base md:text-lg font-semibold text-gray-800">Hero Section (Homepage Top)</h3>
                                    </div>
                                    <div className="grid gap-3 md:gap-4">
                                      <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Hero Title</label>
                                        <Input
                                          value={settings.heroTitle}
                                          onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                                          placeholder="Professional Plumbing Services"
                                          className="text-sm md:text-base h-9 md:h-10"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Hero Subtitle</label>
                                        <Textarea
                                          value={settings.heroSubtitle}
                                          onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                                          placeholder="Brief description of your services"
                                          rows={2}
                                          className="text-sm md:text-base"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Hero Background Image URL</label>
                                        <div className="relative">
                                          <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                          <Input
                                            value={settings.heroImage || ""}
                                            onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                                            placeholder="https://example.com/hero-image.jpg"
                                            className="pl-10 pr-24 text-sm md:text-base h-9 md:h-10"
                                          />
                                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                            <input
                                              type="file"
                                              accept="image/*"
                                              onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                setUploadingImage("heroImage");
                                                try {
                                                  const formData = new FormData();
                                                  formData.append("file", file);
                                                  const res = await fetch("/api/upload", { method: "POST", body: formData });
                                                  const data = await res.json();
                                                  if (data.success) {
                                                    setSettings({ ...settings, heroImage: data.url });
                                                  }
                                                } catch (err) {
                                                  console.error("Upload failed:", err);
                                                } finally {
                                                  setUploadingImage(null);
                                                }
                                              }}
                                              className="hidden"
                                              id="hero-image-upload"
                                            />
                                            <label
                                              htmlFor="hero-image-upload"
                                              className={`cursor-pointer inline-flex items-center gap-1 px-2 py-1 text-xs bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors ${uploadingImage === "heroImage" ? "opacity-50 pointer-events-none" : ""}`}
                                            >
                                              {uploadingImage === "heroImage" ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                              ) : (
                                                <Upload className="h-3 w-3" />
                                              )}
                                              <span className="hidden sm:inline">Upload</span>
                                            </label>
                                          </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Enter a URL or upload an image from your device</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* About Section */}
                                  <div className="bg-white rounded-lg md:rounded-xl border p-3 md:p-5 shadow-sm">
                                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-5">
                                      <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <FileText className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                                      </div>
                                      <h3 className="text-base md:text-lg font-semibold text-gray-800">About Section</h3>
                                    </div>
                                    <div className="grid gap-3 md:gap-4">
                                      <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">About Title</label>
                                        <Input
                                          value={settings.aboutTitle}
                                          onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                                          placeholder="About Us"
                                          className="text-sm md:text-base h-9 md:h-10"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">About Content</label>
                                        <Textarea
                                          value={settings.aboutContent}
                                          onChange={(e) => setSettings({ ...settings, aboutContent: e.target.value })}
                                          placeholder="Tell your customers about your business..."
                                          rows={4}
                                          className="text-sm md:text-base"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">About Image URL</label>
                                        <div className="relative">
                                          <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                          <Input
                                            value={settings.aboutImage || ""}
                                            onChange={(e) => setSettings({ ...settings, aboutImage: e.target.value })}
                                            placeholder="https://example.com/about-image.jpg"
                                            className="pl-10 text-sm md:text-base h-9 md:h-10"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Logo */}
                                  <div className="bg-white rounded-lg md:rounded-xl border p-3 md:p-5 shadow-sm">
                                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-5">
                                      <div className="w-8 h-8 md:w-10 md:h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                        <Image className="h-4 w-4 md:h-5 md:w-5 text-pink-600" />
                                      </div>
                                      <h3 className="text-base md:text-lg font-semibold text-gray-800">Logo</h3>
                                    </div>
                                    <div>
                                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Logo Image URL</label>
                                      <div className="relative">
                                        <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                          value={settings.logoUrl || ""}
                                          onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                                          placeholder="https://example.com/logo.png"
                                          className="pl-10 pr-24 text-sm md:text-base h-9 md:h-10"
                                        />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={async (e) => {
                                              const file = e.target.files?.[0];
                                              if (!file) return;
                                              setUploadingImage("logoUrl");
                                              try {
                                                const formData = new FormData();
                                                formData.append("file", file);
                                                const res = await fetch("/api/upload", { method: "POST", body: formData });
                                                const data = await res.json();
                                                if (data.success) {
                                                  setSettings({ ...settings, logoUrl: data.url });
                                                }
                                              } catch (err) {
                                                console.error("Upload failed:", err);
                                              } finally {
                                                setUploadingImage(null);
                                              }
                                            }}
                                            className="hidden"
                                            id="logo-image-upload"
                                          />
                                          <label
                                            htmlFor="logo-image-upload"
                                            className={`cursor-pointer inline-flex items-center gap-1 px-2 py-1 text-xs bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors ${uploadingImage === "logoUrl" ? "opacity-50 pointer-events-none" : ""}`}
                                          >
                                            {uploadingImage === "logoUrl" ? (
                                              <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                              <Upload className="h-3 w-3" />
                                            )}
                                            <span className="hidden sm:inline">Upload</span>
                                          </label>
                                        </div>
                                      </div>
                                      <p className="text-xs text-gray-400 mt-1">Recommended: PNG with transparent background, 200x60px. Upload or enter a URL.</p>
                                    </div>
                                  </div>

                                  {/* Save Button */}
                                  <div className="flex justify-end sticky bottom-4 bg-gray-50 py-3 md:py-0 md:bg-transparent md:static">
                                    <Button
                                      onClick={saveSettings}
                                      disabled={savingSettings}
                                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 md:px-8 py-2 md:py-3 w-full md:w-auto"
                                    >
                                      {savingSettings ? (
                                        <>
                                          <Loader2 className="h-4 w-4 md:h-5 md:w-5 mr-2 animate-spin" />
                                          Saving...
                                        </>
                                      ) : (
                                        <>
                                          <Check className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                                          Save All Settings
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-12">
                                  <Loader2 className="h-8 w-8 mx-auto text-emerald-500 animate-spin" />
                                  <p className="text-gray-500 mt-4">Loading settings...</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
