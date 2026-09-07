import Link from "next/link";
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
      { label: "Collection", href: "/collection" },
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

const contactLinks = [
  { label: "Social Media", href: "https://facebook.com" },
  { label: "WhatsApp", href: "https://wa.me/2349070548182" },
  { label: "Email", href: "mailto:hello@ajluxeperfume.com" },
];

const socials = [
  { Icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { Icon: TwitterIcon, label: "Twitter", href: "https://twitter.com" },
  { Icon: LinkedinIcon, label: "LinkedIn", href: "https://linkedin.com" },
];

export function Footer() {
  return (
    <footer className="bg-aubergine text-cream/90 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-12">
        <div className="flex justify-end gap-3 mb-8">
          {socials.map(({ Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-aubergine hover:bg-magenta-light hover:text-white transition-colors"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-magenta-light transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/60">
          <p>© {new Date().getFullYear()} AJLuxePerfume All Right Reserved</p>
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
