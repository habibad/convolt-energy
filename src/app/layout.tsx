import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/common/CustomCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://convaltenergy.com"),
  title: "Convalt Energy — Powering a Cleaner Tomorrow",
  description:
    "From solar manufacturing to power generation, data centers and recycling — Convalt Energy builds a more sustainable world through innovation and scale.",
  keywords: [
    "Convalt Energy",
    "Clean Energy",
    "Solar Manufacturing",
    "Power Generation",
    "Data Centers",
    "Recycling",
    "Sustainability",
    "Infrastructure",
  ],
  authors: [{ name: "Convalt Energy" }],
  openGraph: {
    title: "Convalt Energy — Powering a Cleaner Tomorrow",
    description:
      "From solar manufacturing to power generation, data centers and recycling — Convalt Energy builds a more sustainable world through innovation and scale.",
    url: "https://convaltenergy.com",
    siteName: "Convalt Energy",
    images: [
      {
        url: "/media/hero/convalt-hero-master.webp",
        width: 1672,
        height: 941,
        alt: "Convalt Energy Hero Landscape",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convalt Energy — Powering a Cleaner Tomorrow",
    description:
      "From solar manufacturing to power generation, data centers and recycling — Convalt Energy builds a more sustainable world through innovation and scale.",
    images: ["/media/hero/convalt-hero-master.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#101A1D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#101A1D] text-[#101A1D]">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
