// Placeholder testimonial copy — swap for real customer quotes once collected.
const testimonials = [
  {
    name: "Roberta Fox",
    quote:
      "I'm always impressed with the wide range of authentic fragrances and friendly staff who help me find the perfect scent every time.",
  },
  {
    name: "Brooklyn Simmons",
    quote:
      "Great shopping experience — knowledgeable team, quick service, and genuine perfumes I can trust.",
  },
  {
    name: "Leslie Alexander",
    quote:
      "Fast delivery, secure packaging, and amazing scents. I keep coming back for more!",
  },
  {
    name: "Devon Lake",
    quote:
      "The scent recommendations actually matched what I described. My new signature fragrance came from AJ Luxe.",
  },
  {
    name: "Amara Chukwu",
    quote:
      "Every order has arrived exactly as described, well packaged, and on time. Reliable is rare in this market.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function Testimonials() {
  // Duplicated once so the marquee track can loop seamlessly at -50%.
  const track = [...testimonials, ...testimonials];

  return (
    <section className="bg-lavender-light/40 py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center mb-10">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-aubergine">
          What our customers say
        </h2>
        <p className="mt-4 text-charcoal-soft max-w-md mx-auto">
          Our customers consistently share that every purchase from AJ Luxe
          Perfume delivers confidence, luxury, elegance, and sophistication.
        </p>
      </div>

      <div className="marquee-track flex w-max gap-6 px-4 sm:px-6">
        {track.map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            className="marquee-card shrink-0 w-72 sm:w-80 bg-white rounded-2xl p-6 shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-lavender flex items-center justify-center text-sm font-semibold text-aubergine shrink-0">
                {initials(t.name)}
              </div>
              <p className="font-display font-semibold text-charcoal">
                {t.name}
              </p>
            </div>
            <p className="text-sm text-charcoal-soft leading-relaxed">
              {t.quote}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
