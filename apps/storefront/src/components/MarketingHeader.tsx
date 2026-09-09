"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, User } from "lucide-react";
import { Logo } from "./Logo";
import type { SessionIdentity } from "@/lib/auth";

const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collection", href: "/collection" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export function MarketingHeader({
  identity,
}: {
  identity: SessionIdentity | null;
}) {
  const [open, setOpen] = useState(false);

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

        <div className="hidden sm:block relative ml-auto md:ml-0 w-32 sm:w-44">
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

        <Link
          href={identity ? "/account" : "/login"}
          className="hidden md:flex items-center gap-1.5 text-sm font-medium text-charcoal hover:text-magenta transition-colors shrink-0"
        >
          <User size={16} strokeWidth={1.75} />
          <span className="max-w-[100px] truncate">
            {identity ? `Hi, ${identity.firstName}` : "Sign In"}
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden ml-auto text-charcoal p-1"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-charcoal/5 bg-lavender-light/95 backdrop-blur-sm px-4 sm:px-6 py-4">
          <div className="relative mb-4">
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
          <nav className="flex flex-col gap-1 text-sm font-medium text-charcoal">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-2.5 hover:text-magenta transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={identity ? "/account" : "/login"}
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 py-2.5 border-t border-charcoal/5 mt-1 pt-3 hover:text-magenta transition-colors"
            >
              <User size={16} strokeWidth={1.75} />
              {identity ? `Hi, ${identity.firstName}` : "Sign In"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
