"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// Custom events for real-time sync
export const SETTINGS_UPDATED_EVENT = "site-settings-updated";
export const SERVICES_UPDATED_EVENT = "site-services-updated";

export interface SiteSettings {
  id: string;
  businessName: string;
  phone: string;
  phone2: string | null;
  email: string;
  address: string;
  businessHours: string;
  is24_7: boolean;
  mondayOpen: string;
  mondayClose: string;
  tuesdayOpen: string;
  tuesdayClose: string;
  wednesdayOpen: string;
  wednesdayClose: string;
  thursdayOpen: string;
  thursdayClose: string;
  fridayOpen: string;
  fridayClose: string;
  saturdayOpen: string;
  saturdayClose: string;
  sundayOpen: string;
  sundayClose: string;
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

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string | null;
  order: number;
  active: boolean;
}

interface SiteContextType {
  settings: SiteSettings | null;
  services: Service[];
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  refreshServices: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch("/api/settings?t=" + Date.now(), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch("/api/services?t=" + Date.now(), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  const refreshServices = useCallback(async () => {
    await fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([fetchSettings(), fetchServices()]);
      setIsLoading(false);
    };
    init();
  }, [fetchSettings, fetchServices]);

  // Listen for update events
  useEffect(() => {
    const handleSettingsUpdate = () => fetchSettings();
    const handleServicesUpdate = () => fetchServices();

    window.addEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
    window.addEventListener(SERVICES_UPDATED_EVENT, handleServicesUpdate);

    return () => {
      window.removeEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
      window.removeEventListener(SERVICES_UPDATED_EVENT, handleServicesUpdate);
    };
  }, [fetchSettings, fetchServices]);

  // Refresh on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchSettings();
        fetchServices();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchSettings, fetchServices]);

  return (
    <SiteContext.Provider value={{ settings, services, isLoading, refreshSettings, refreshServices }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSite must be used within SiteProvider");
  return context;
}

// Time slot generation based on working hours
export function generateTimeSlots(settings: SiteSettings | null, date: string | Date): string[] {
  if (settings?.is24_7) return generateAllTimeSlots();
  if (!settings) return generateAllTimeSlots();

  const dayOfWeek = typeof date === 'string' ? new Date(date).getDay() : date.getDay();
  let openTime: string, closeTime: string;

  switch (dayOfWeek) {
    case 0: openTime = settings.sundayOpen; closeTime = settings.sundayClose; break;
    case 1: openTime = settings.mondayOpen; closeTime = settings.mondayClose; break;
    case 2: openTime = settings.tuesdayOpen; closeTime = settings.tuesdayClose; break;
    case 3: openTime = settings.wednesdayOpen; closeTime = settings.wednesdayClose; break;
    case 4: openTime = settings.thursdayOpen; closeTime = settings.thursdayClose; break;
    case 5: openTime = settings.fridayOpen; closeTime = settings.fridayClose; break;
    case 6: openTime = settings.saturdayOpen; closeTime = settings.saturdayClose; break;
    default: return generateAllTimeSlots();
  }

  if (openTime === "00:00" && closeTime === "00:00") return [];
  return generateTimeSlotsBetween(openTime, closeTime);
}

function generateAllTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  return slots;
}

function generateTimeSlotsBetween(open: string, close: string): string[] {
  const slots: string[] = [];
  const [openH, openM] = open.split(":").map(Number);
  const [closeH, closeM] = close.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  for (let m = openMinutes; m < closeMinutes; m += 30) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`);
  }
  return slots;
}

export function formatTimeSlot(slot: string): string {
  const [h, m] = slot.split(":");
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${period}`;
}
