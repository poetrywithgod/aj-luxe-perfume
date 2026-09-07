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
];

export function Testimonials() {
  return (
    <section className="bg-lavender-light/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-aubergine">
            What our customers say
          </h2>
          <p className="mt-4 text-charcoal-soft max-w-sm">
            Our customers consistently share that every purchase from AJ
            Luxe Perfume delivers confidence, luxury, elegance, and
            sophistication.
          </p>
        </div>

        <div className="space-y-4">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-5 shadow-sm"
              style={{ marginLeft: i % 2 === 1 ? "2rem" : 0 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-lavender shrink-0" />
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
      </div>
    </section>
  );
}
