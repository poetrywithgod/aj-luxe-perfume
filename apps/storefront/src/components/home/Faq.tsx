"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Do you offer unisex fragrances?",
    answer:
      "Yes — our collection includes fragrances for men, women, children, and unisex scents suited to any style.",
  },
  {
    question: "How long do the scents last?",
    answer:
      "Most of our eau de parfums last 6–8 hours on the skin, depending on your skin type and the specific fragrance.",
  },
  {
    question: "Can I get recommendations for a scent?",
    answer:
      "Definitely. Reach out via WhatsApp or our contact page and our team will help you find a scent that matches your style.",
  },
  {
    question: "Do you deliver?",
    answer:
      "We deliver within Port Harcourt in 24–48 hours, and nationwide in 24–72 hours depending on your location.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h2 className="font-display text-3xl sm:text-4xl font-semibold text-aubergine mb-8">
        Frequently asked questions
      </h2>
      <dl className="divide-y divide-charcoal/10">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={faq.question} className="py-5">
              <dt>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between text-left gap-4"
                >
                  <span className="font-display text-lg font-medium text-charcoal">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <Minus size={18} className="text-aubergine shrink-0" />
                  ) : (
                    <Plus size={18} className="text-aubergine shrink-0" />
                  )}
                </button>
              </dt>
              {isOpen && (
                <dd className="mt-3 text-sm text-charcoal-soft leading-relaxed pr-8">
                  {faq.answer}
                </dd>
              )}
            </div>
          );
        })}
      </dl>
    </section>
  );
}
