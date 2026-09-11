import type { Metadata } from "next";
import { MapPin, Mail, MessageCircle, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { ClosingCta } from "@/components/home/ClosingCta";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with AJ Luxe Perfume — questions about an order, a fragrance, or anything else.",
};

const details = [
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: "+234 907 054 8182",
    href: "https://wa.me/2349070548182",
  },
  {
    Icon: Mail,
    label: "Email",
    value: "hello@ajluxeperfume.com",
    href: "mailto:hello@ajluxeperfume.com",
  },
  {
    Icon: MapPin,
    label: "Location",
    value: "Port Harcourt, Rivers State, Nigeria",
    href: undefined,
  },
  {
    Icon: Clock,
    label: "Hours",
    value: "Mon – Sat, 9am – 6pm",
    href: undefined,
  },
];

export default function ContactPage() {
  return (
    <div>
      <section className="bg-aubergine">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-cream">
            Get In Touch
          </h1>
          <p className="mt-4 text-cream/75 max-w-xl mx-auto leading-relaxed">
            Questions about an order, a fragrance, or anything else — we&apos;d
            love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 grid md:grid-cols-[280px_1fr] gap-10">
        <div className="space-y-6">
          {details.map(({ Icon, label, value, href }) => {
            const content = (
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-full bg-lavender-light/60 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-aubergine" />
                </span>
                <div>
                  <p className="text-xs text-charcoal-soft uppercase tracking-wide">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-charcoal mt-0.5">
                    {value}
                  </p>
                </div>
              </div>
            );
            return href ? (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block hover:opacity-80 transition-opacity"
              >
                {content}
              </a>
            ) : (
              <div key={label}>{content}</div>
            );
          })}
        </div>

        <ContactForm />
      </section>

      <ClosingCta />
    </div>
  );
}
