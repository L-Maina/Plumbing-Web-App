import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Climate Tech Plumbing & Renovators | Nairobi Kenya",
  description: "Professional plumbing, borehole drilling, and renovation services in Nairobi, Kenya. 24/7 emergency services available.",
  keywords: "plumbing, borehole, renovation, Nairobi, Kenya, emergency plumbing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
