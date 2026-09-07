import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { BestSellers } from "@/components/home/BestSellers";
import { About } from "@/components/home/About";
import { Testimonials } from "@/components/home/Testimonials";
import { Faq } from "@/components/home/Faq";
import { ClosingCta } from "@/components/home/ClosingCta";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AJ Luxe Perfume",
    description:
      "Authentic luxury perfumes, diffusers, body sprays, and scent candles, delivered across Nigeria.",
    url: "https://ajluxeperfume.com",
    telephone: "+2349070548182",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Port Harcourt",
      addressCountry: "NG",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Features />
      <BestSellers />
      <About />
      <Testimonials />
      <Faq />
      <ClosingCta />
    </>
  );
}
