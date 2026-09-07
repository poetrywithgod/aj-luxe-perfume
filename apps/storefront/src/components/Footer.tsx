import Link from "next/link";
import { Phone } from "lucide-react";
import { FacebookIcon, TwitterIcon, LinkedinIcon } from "./SocialIcons";

const columns = [
  {
    heading: "About",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "Pages",
    links: [
      { label: "Services", href: "/services" },
      { label: "Collection", href: "/shop" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Store", href: "/shop" },
      { label: "Fragrance", href: "/shop/perfumes" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-aubergine text-cream/90 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {columns.map((col) => (
          <div key={col.heading}>
            <h3 className="font-display text-lg text-cream mb-4">
              {col.heading}
            </h3>
            <ul className="space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-magenta-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-display text-lg text-cream mb-4">
            Contact Us
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://facebook.com"
                className="hover:text-magenta-light transition-colors"
              >
                Social Media
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/2349070548182"
                className="hover:text-magenta-light transition-colors"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@ajluxeperfume.com"
                className="hover:text-magenta-light transition-colors"
              >
                Email
              </a>
            </li>
          </ul>
          <a
            href="tel:+2349070548182"
            className="flex items-center gap-2 text-sm mt-4 hover:text-magenta-light transition-colors"
          >
            <Phone size={14} />
            0907 054 8182
          </a>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/60">
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="hover:text-cream transition-colors"
            >
              <FacebookIcon size={16} />
            </a>
            <a
              href="https://twitter.com"
              aria-label="Twitter"
              className="hover:text-cream transition-colors"
            >
              <TwitterIcon size={16} />
            </a>
            <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              className="hover:text-cream transition-colors"
            >
              <LinkedinIcon size={16} />
            </a>
          </div>
          <p>© {new Date().getFullYear()} AJ Luxe Perfume. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-cream transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-cream transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
