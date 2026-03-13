import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.climate-tech.co.ke"),
  title: "Climate Tech Plumbing & Renovators | Professional Plumbing Services Nairobi Kenya",
  description: "Nairobi's trusted plumbing experts since 2015. Professional plumbing installation, repairs, bathroom renovations, emergency plumbing services. Available 24/7. Call 0720 219802.",
  keywords: [
    "plumbing services Nairobi",
    "plumber Kenya",
    "emergency plumbing Nairobi",
    "bathroom renovation Nairobi",
    "pipe repair Nairobi",
    "water heater installation Kenya",
    "plumbing installation Thika Road",
    "24/7 plumber Nairobi",
    "drain cleaning Nairobi",
    "professional plumber Kenya",
  ],
  authors: [{ name: "Climate Tech Plumbing & Renovators" }],
  icons: {
    icon: [
      { url: "/images/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/images/logo.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/images/logo.png" },
    ],
  },
  openGraph: {
    title: "Climate Tech Plumbing & Renovators | Professional Plumbing Services Nairobi",
    description: "Nairobi's trusted plumbing experts. 24/7 emergency services, bathroom renovations, pipe repairs. Call 0720 219802.",
    url: "https://www.climate-tech.co.ke",
    siteName: "Climate Tech Plumbing & Renovators",
    type: "website",
    locale: "en_KE",
    images: [
      {
        url: "/images/hero.png",
        width: 1344,
        height: 768,
        alt: "Climate Tech Plumbing Services Nairobi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Climate Tech Plumbing & Renovators | Nairobi Plumbing Experts",
    description: "Professional plumbing services in Nairobi. 24/7 emergency, renovations, repairs. Call 0720 219802.",
    images: ["/images/hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://www.climate-tech.co.ke",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Nairobi" />
        <meta name="geo.position" content="-1.286389;36.817223" />
        <meta name="ICBM" content="-1.286389, 36.817223" />
        <meta name="format-detection" content="telephone=+254720219802" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
