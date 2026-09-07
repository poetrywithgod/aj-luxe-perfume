import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Footer } from "@/components/Footer";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "AJ Luxe Perfume | Authentic Luxury Fragrances in Nigeria",
    template: "%s | AJ Luxe Perfume",
  },
  description:
    "Shop authentic luxury perfumes, diffusers, body sprays, and scent candles in Nigeria. Fast delivery in Port Harcourt and nationwide. Your fragrance journey starts here.",
  keywords: [
    "perfume Nigeria",
    "luxury fragrance Port Harcourt",
    "buy perfume online Nigeria",
    "authentic perfume Nigeria",
    "AJ Luxe Perfume",
  ],
  openGraph: {
    title: "AJ Luxe Perfume | Authentic Luxury Fragrances in Nigeria",
    description:
      "Shop authentic luxury perfumes, diffusers, body sprays, and scent candles. Fast delivery in Port Harcourt and nationwide.",
    siteName: "AJ Luxe Perfume",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal font-sans">
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
