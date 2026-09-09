"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, LogOut, Save } from "lucide-react";

// No auth/session system exists yet (no login page, no session cookie,
// though Customer already has a passwordHash field ready for one) — so
// there's no way to know who's actually logged in. Everything below is
// placeholder data shaping out the UI a real account page needs; wire it
// to a real session + Prisma customer lookup once auth exists.
const MOCK_CUSTOMER = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
  phone: "+234 907 054 8182",
  memberSince: "2026",
};

function initials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

type Tab = "profile" | "orders";

function inputClass() {
  return "w-full rounded-xl border border-aubergine/20 bg-white px-4 py-3 text-base outline-none focus:border-aubergine focus:ring-2 focus:ring-aubergine/10 transition";
}

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No backend endpoint exists yet to persist profile edits — this just
    // acknowledges the submit locally.
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl text-aubergine mb-8">
        My Account
      </h1>

      <div className="bg-white rounded-2xl border border-aubergine/10 shadow-sm p-6 sm:p-8 mb-8 flex flex-wrap items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-lavender flex items-center justify-center text-xl font-display font-semibold text-aubergine shrink-0">
          {initials(MOCK_CUSTOMER.firstName, MOCK_CUSTOMER.lastName)}
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="font-display text-xl text-aubergine">
            {MOCK_CUSTOMER.firstName} {MOCK_CUSTOMER.lastName}
          </p>
          <p className="text-sm text-charcoal-soft">{MOCK_CUSTOMER.email}</p>
          <p className="text-xs text-charcoal-soft mt-1">
            Member since {MOCK_CUSTOMER.memberSince}
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-aubergine/20 px-5 py-2.5 text-sm font-medium text-aubergine hover:bg-lavender-light/50 transition-colors"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>

      <div className="flex items-center gap-1 border-b border-aubergine/10 mb-8">
        {(
          [
            { key: "profile", label: "Profile" },
            { key: "orders", label: "Order History" },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key
                ? "border-magenta-deep text-magenta-deep"
                : "border-transparent text-charcoal-soft hover:text-aubergine"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" ? (
        <div className="bg-white rounded-2xl border border-aubergine/10 shadow-sm p-6 sm:p-8">
          <h2 className="font-display text-xl text-aubergine mb-6">
            Personal Information
          </h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-aubergine mb-2">
                  First Name
                </label>
                <input
                  defaultValue={MOCK_CUSTOMER.firstName}
                  name="firstName"
                  className={inputClass()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-aubergine mb-2">
                  Last Name
                </label>
                <input
                  defaultValue={MOCK_CUSTOMER.lastName}
                  name="lastName"
                  className={inputClass()}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-aubergine mb-2">
                Email Address
              </label>
              <input
                defaultValue={MOCK_CUSTOMER.email}
                name="email"
                type="email"
                className={inputClass()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-aubergine mb-2">
                Phone Number
              </label>
              <input
                defaultValue={MOCK_CUSTOMER.phone}
                name="phone"
                type="tel"
                className={inputClass()}
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-aubergine text-cream text-sm font-medium px-6 py-3 hover:bg-aubergine-light transition-colors"
              >
                <Save size={16} />
                Save Changes
              </button>
              {saved && (
                <span className="text-sm text-magenta-deep">
                  Saved (not yet persisted — no backend wired up).
                </span>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-aubergine/10 shadow-sm p-6 sm:p-8">
          <h2 className="font-display text-xl text-aubergine mb-6">
            Order History
          </h2>
          <div className="rounded-xl border border-dashed border-aubergine/20 py-16 text-center">
            <Package className="mx-auto text-aubergine/30 mb-3" size={32} />
            <p className="text-charcoal-soft mb-6">
              No orders yet — once you check out, they&apos;ll show up here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center rounded-lg bg-aubergine text-cream text-sm font-medium px-6 py-3 hover:bg-aubergine-light transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
