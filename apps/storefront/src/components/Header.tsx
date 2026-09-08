import Link from "next/link";
import { Search, ShoppingBag, User, LogOut, ChevronDown } from "lucide-react";

const categories = [
  { label: "Perfumes", href: "/shop/perfumes" },
  { label: "Diffusers", href: "/shop/diffusers" },
  { label: "Body Spray", href: "/shop/body-spray" },
  { label: "Scent Candles", href: "/shop/scent-candles" },
];

const announcements = [
  "Discount on all First Time Order",
  "Free Delivery on all orders above NGN 100,000 within PH",
  "We are open Mon – Sat, 8am – 6pm",
  // Handle per the latest Figma spec: "ajscent_6" — the source label was
  // still clipped there, so double check the live TikTok profile in case
  // the full handle continues past this.
  "Follow us on TikTok: ajscent_6",
];

export function Header() {
  // Duplicated once so the ticker can loop seamlessly at -50% translate.
  const ticker = [...announcements, ...announcements];

  return (
    <header className="sticky top-0 z-50 bg-cream">
      {/* Announcement ticker */}
      <div className="bg-plum text-cream text-xs sm:text-sm h-8 flex items-center overflow-hidden">
        <div className="ticker-track flex items-center gap-8 whitespace-nowrap px-4">
          {ticker.map((line, i) => (
            <span key={i} className="flex items-center gap-8 shrink-0">
              {line}
              <span className="text-magenta-light" aria-hidden="true">
                ♦
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Main header: logo, search, icons */}
      <div className="border-b border-charcoal/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center gap-6">
          <Link href="/" className="shrink-0">
            <span className="font-display text-2xl sm:text-3xl font-semibold text-aubergine leading-none block">
              AJ Luxe Perfume
            </span>
            <span className="text-[11px] tracking-wide text-charcoal-soft block mt-0.5">
              Your Fragrance Journey is Our Priority
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md ml-auto relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft"
              size={18}
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search Product..."
              className="w-full rounded-full border border-charcoal/15 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-aubergine focus:ring-2 focus:ring-aubergine/20 transition"
            />
          </div>

          <nav className="flex items-center gap-4 sm:gap-6 ml-auto md:ml-0 text-xs">
            <Link
              href="/cart"
              className="flex flex-col items-center gap-1 text-charcoal hover:text-aubergine transition-colors"
            >
              <span className="relative">
                <ShoppingBag size={20} strokeWidth={1.75} />
                <span className="absolute -top-1.5 -right-1.5 bg-magenta text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </span>
              <span className="hidden sm:block">My Cart</span>
            </Link>
            <Link
              href="/account"
              className="flex flex-col items-center gap-1 text-charcoal hover:text-aubergine transition-colors"
            >
              <User size={20} strokeWidth={1.75} />
              <span className="hidden sm:block">Profile</span>
            </Link>
            <Link
              href="/checkout"
              className="flex flex-col items-center gap-1 text-charcoal hover:text-aubergine transition-colors"
            >
              <LogOut size={20} strokeWidth={1.75} />
              <span className="hidden sm:block">Checkout</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Category nav */}
      <div className="bg-lavender">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <ul className="flex items-center gap-6 sm:gap-8 text-sm font-medium text-aubergine overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <li key={cat.href} className="shrink-0">
                <Link
                  href={cat.href}
                  className="flex items-center gap-1 hover:opacity-70 transition-opacity"
                >
                  {cat.label}
                  <ChevronDown size={14} strokeWidth={2} />
                </Link>
              </li>
            ))}
          </ul>
          <span className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-aubergine shrink-0 ml-4">
            <ShoppingBag size={16} strokeWidth={1.75} />
            NGN 0
          </span>
        </div>
      </div>
    </header>
  );
}
