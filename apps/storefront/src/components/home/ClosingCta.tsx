import Link from "next/link";

export function ClosingCta() {
  return (
    <section className="bg-magenta-deep">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
    <div className="text-cream text-center sm:text-left">
      <p className="font-display text-[48px] leading-[1.15] font-bold tracking-[-0.02em]">
        AJ Luxe Perfume
      </p>

      <p className="text-cream/70 mt-1 text-[20px] leading-[1.4] font-medium">
        Where confidence meets luxury.
      </p>
    </div>

    <Link
      href="/shop"
      className="shrink-0 inline-flex items-center rounded-full bg-magenta px-8 py-3.5 text-sm font-bold text-white hover:bg-magenta-light transition-colors"
    >
      Order Now
    </Link>
  </div>
</section>
  );
}
