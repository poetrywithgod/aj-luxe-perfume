import Link from "next/link";
import { Search } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collection", href: "/collection" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-lavender-light/70 backdrop-blur-sm border-b border-charcoal/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center gap-6">
        <Logo />

        <nav className="hidden md:flex items-center gap-7 mx-auto text-sm font-medium text-charcoal">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-magenta transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="relative ml-auto md:ml-0 w-32 sm:w-44">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-soft"
            size={16}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search"
            className="w-full rounded-full border border-charcoal/15 bg-white/80 py-2 pl-9 pr-3 text-sm outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/20 transition"
          />
        </div>
      </div>
    </header>
  );
}
