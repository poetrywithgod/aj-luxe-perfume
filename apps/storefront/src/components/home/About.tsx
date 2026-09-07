import Link from "next/link";

export function About() {
  return (
    <section className="bg-aubergine">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/5] max-w-sm mx-auto w-full order-2 md:order-1">
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-magenta/25 via-lavender/20 to-transparent" />
          <div className="absolute inset-8 flex items-center justify-center">
            <div className="w-20 h-32 rounded-t-full rounded-b-lg bg-gradient-to-b from-cream/90 to-cream/50" />
          </div>
        </div>

        <div className="text-cream order-1 md:order-2">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">
            About Us
          </h2>
          <p className="mt-5 text-cream/80 leading-relaxed max-w-md">
            Our goal is simple: to provide affordable luxury fragrances that
            suit every mood, style, and occasion. At AJ Luxe Perfume, we
            don&apos;t just sell perfumes — we create experiences that
            linger.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center mt-8 rounded-full bg-cream text-aubergine px-8 py-3.5 text-sm font-semibold hover:bg-lavender-light transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
