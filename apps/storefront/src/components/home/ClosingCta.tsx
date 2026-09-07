import Link from "next/link";

export function ClosingCta() {
  return (
    <section className="bg-aubergine">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-cream text-center sm:text-left">
          <p className="font-display text-2xl sm:text-3xl font-semibold">
            AJ Luxe Perfume
          </p>
          <p className="text-cream/70 mt-1">
            Where confidence meets luxury.
          </p>
        </div>
        <Link
          href="/shop"
          className="shrink-0 inline-flex items-center rounded-full bg-magenta px-8 py-3.5 text-sm font-semibold text-white hover:bg-magenta-light transition-colors"
        >
          Order Now
        </Link>
      </div>
    </section>
  );
}
