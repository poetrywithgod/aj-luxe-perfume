import type { Metadata } from "next";
import { Sparkles, HandHeart, ShieldCheck, MapPinned } from "lucide-react";
import { ClosingCta } from "@/components/home/ClosingCta";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "AJ Luxe Perfume is a Port Harcourt-based fragrance house bringing affordable, authentic luxury scents to Nigeria.",
};

const values = [
  {
    Icon: ShieldCheck,
    title: "Authenticity First",
    description:
      "Every fragrance we sell is genuine — sourced and verified, never diluted or repackaged.",
  },
  {
    Icon: Sparkles,
    title: "Luxury, Made Affordable",
    description:
      "Beautiful scents shouldn't be out of reach. We keep quality high and prices honest.",
  },
  {
    Icon: HandHeart,
    title: "Care in Every Order",
    description:
      "From how we package a bottle to how we answer a message, every touchpoint is deliberate.",
  },
  {
    Icon: MapPinned,
    title: "Proudly Port Harcourt",
    description:
      "Built in Rivers State, for fragrance lovers everywhere we deliver.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-aubergine">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-cream">
            About AJ Luxe Perfume
          </h1>
          <p className="mt-4 text-cream/75 max-w-xl mx-auto leading-relaxed">
            Affordable luxury fragrances that suit every mood, style, and
            occasion.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/5] max-w-sm mx-auto w-full">
          <div className="absolute inset-0 rounded-[2.5rem] bg-linear-to-br from-magenta/20 via-lavender/25 to-transparent" />
          <div className="absolute inset-8 flex items-center justify-center">
            <div className="w-24 h-36 rounded-t-full rounded-b-lg bg-linear-to-b from-white/90 to-lavender-light shadow-xl" />
          </div>
        </div>

        <div>
          <h2 className="font-display text-3xl text-aubergine font-semibold mb-5">
            Our Story
          </h2>
          <p className="text-charcoal-soft leading-relaxed mb-4">
            AJ Luxe Perfume started with a simple belief: a great fragrance
            shouldn&apos;t come with a luxury price tag attached to it for no
            reason. We wanted to build a place in Port Harcourt where anyone
            could walk in — or log on — and find a scent that actually feels
            like them.
          </p>
          <p className="text-charcoal-soft leading-relaxed">
            We don&apos;t just sell perfumes — we create experiences that
            linger. Every bottle we stock is chosen and verified for
            authenticity, because trust is the one thing we&apos;re not
            willing to compromise on.
          </p>
        </div>
      </section>

      <section className="bg-lavender-light/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <h2 className="font-display text-3xl text-aubergine font-semibold text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="text-center sm:text-left">
                <span className="inline-flex w-12 h-12 rounded-full bg-white items-center justify-center mb-4">
                  <v.Icon size={22} className="text-magenta" strokeWidth={1.75} />
                </span>
                <h3 className="font-sans text-base font-bold text-charcoal mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-charcoal-soft leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClosingCta />
    </div>
  );
}
