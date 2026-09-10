import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "AJ Luxe Perfume — Admin",
    template: "%s | AJ Luxe Perfume Admin",
  },
  description: "Admin dashboard for AJ Luxe Perfume.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col bg-cream text-charcoal font-sans"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
