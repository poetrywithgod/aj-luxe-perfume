"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Star, MessageSquare, LogOut } from "lucide-react";
import type { SessionAdmin } from "@/lib/auth";

const NAV = [
  { href: "/reviews", label: "Reviews", Icon: Star },
  { href: "/inbox", label: "Inbox", Icon: MessageSquare },
] as const;

export function Sidebar({ admin }: { admin: SessionAdmin }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-56 shrink-0 border-r border-aubergine/10 bg-white flex flex-col">
      <div className="px-5 py-6 border-b border-aubergine/10">
        <p className="font-semibold text-aubergine leading-tight">
          AJ Luxe Perfume
        </p>
        <p className="text-xs text-charcoal-soft mt-0.5">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-aubergine text-cream"
                  : "text-charcoal hover:bg-lavender-light/50"
              }`}
            >
              <Icon size={17} strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-aubergine/10">
        <p className="px-3 text-sm font-medium text-charcoal truncate">
          {admin.name}
        </p>
        <p className="px-3 text-xs text-charcoal-soft truncate mb-3">
          {admin.email}
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal hover:bg-lavender-light/50 transition-colors"
        >
          <LogOut size={17} strokeWidth={1.75} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
