import { ShieldCheck, LayoutGrid, Truck, Sparkles } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Authentic Scents",
    description: "Only original, high quality fragrances you can trust.",
  },
  {
    icon: LayoutGrid,
    title: "Wide Selection",
    description: "From everyday wear to luxury picks, find your perfect scent.",
  },
  {
    icon: Truck,
    title: "Fast & Reliable Delivery",
    description: "Get your fragrance delivered quickly and safely.",
  },
  {
    icon: Sparkles,
    title: "Tailored Fragrance",
    description: "Find a scent that truly matches your style and personality.",
  },
];

export function Features() {
  return (
    <section className="bg-lavender-light/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        {/*
          No real product photography yet — placeholder box + bottle art,
          matching the tones used elsewhere. Swap for a real product photo
          once uploaded via the admin panel.
        */}
        <div className="relative aspect-[4/3] max-w-md mx-auto w-full">
          <div className="absolute left-0 bottom-0 w-32 sm:w-36 h-40 sm:h-44 rounded-lg shadow-xl bg-linear-to-br from-[#e8a98c] to-[#c47a5c]" />
          <div className="absolute left-24 sm:left-28 bottom-0 w-16 sm:w-20 h-48 sm:h-56 rounded-t-[2rem] rounded-b-lg shadow-xl bg-linear-to-b from-white/90 to-lavender-light">
            <div className="w-6 h-5 mx-auto -translate-y-1.5 rounded-sm bg-charcoal/70" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col gap-3">
              <f.icon className="text-magenta" size={28} strokeWidth={1.5} />
              <h3 className="font-sans text-lg font-bold text-charcoal">
                {f.title}
              </h3>
              <p className="text-sm text-charcoal-soft leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
