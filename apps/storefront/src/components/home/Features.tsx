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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col gap-3">
            <f.icon className="text-aubergine" size={28} strokeWidth={1.5} />
            <h3 className="font-display text-lg font-semibold text-aubergine">
              {f.title}
            </h3>
            <p className="text-sm text-charcoal-soft leading-relaxed">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
