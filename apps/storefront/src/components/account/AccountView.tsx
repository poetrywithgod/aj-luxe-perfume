"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, LogOut, Save } from "lucide-react";
import { formatNaira } from "@/lib/format";
import type { SessionCustomer } from "@/lib/auth";

export type OrderSummary = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  itemCount: number;
};

function initials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

function inputClass() {
  return "w-full rounded-xl border border-aubergine/20 bg-white px-4 py-3 text-base outline-none focus:border-aubergine focus:ring-2 focus:ring-aubergine/10 transition";
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  PREPARING: "Preparing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

type Tab = "profile" | "orders";

export function AccountView({
  customer,
  orders,
}: {
  customer: SessionCustomer;
  orders: OrderSummary[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState(customer);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "saved-pending-email" | "error"
  >("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaveState("saving");
    setSaveError(null);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
        email: form.get("email"),
        phone: form.get("phone"),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setSaveError(data?.error ?? "Something went wrong. Please try again.");
      setSaveState("error");
      return;
    }

    const updated = await res.json();
    // A changed email doesn't land in `email` yet — it sits in
    // `pendingEmail` until the confirmation link is clicked (see
    // /account/verify-email), so the visible email field should keep
    // showing the still-current address, not the one just submitted.
    setProfile((p) => ({
      ...p,
      firstName: updated.firstName,
      lastName: updated.lastName,
      phone: updated.phone,
      email: updated.email,
      pendingEmail: updated.pendingEmail,
    }));
    setSaveState(updated.emailChangePending ? "saved-pending-email" : "saved");
    setTimeout(
      () => setSaveState("idle"),
      updated.emailChangePending ? 6000 : 2500,
    );
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl text-aubergine mb-8">
        My Account
      </h1>

      <div className="bg-white rounded-2xl border border-aubergine/10 shadow-sm p-6 sm:p-8 mb-8 flex flex-wrap items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-lavender flex items-center justify-center text-xl font-display font-semibold text-aubergine shrink-0">
          {initials(profile.firstName, profile.lastName)}
        </div>
        <div className="flex-1 min-w-[200px]">
          <p className="font-display text-xl text-aubergine">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="text-sm text-charcoal-soft">{profile.email}</p>
          <p className="text-xs text-charcoal-soft mt-1">
            Member since{" "}
            {new Date(profile.createdAt).toLocaleDateString("en-NG", {
              year: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 rounded-lg border border-aubergine/20 px-5 py-2.5 text-sm font-medium text-aubergine hover:bg-lavender-light/50 transition-colors disabled:opacity-60"
        >
          <LogOut size={16} />
          {loggingOut ? "Logging out..." : "Log Out"}
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
            {saveError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {saveError}
              </p>
            )}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-aubergine mb-2">
                  First Name
                </label>
                <input
                  required
                  defaultValue={profile.firstName}
                  name="firstName"
                  className={inputClass()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-aubergine mb-2">
                  Last Name
                </label>
                <input
                  required
                  defaultValue={profile.lastName}
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
                required
                defaultValue={profile.email}
                name="email"
                type="email"
                className={inputClass()}
              />
              {profile.pendingEmail && (
                <p className="text-xs text-magenta-deep bg-magenta-light/10 rounded-lg px-3 py-2 mt-2">
                  Confirmation sent to {profile.pendingEmail} — your login
                  email stays {profile.email} until you confirm it.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-aubergine mb-2">
                Phone Number
              </label>
              <input
                defaultValue={profile.phone ?? ""}
                name="phone"
                type="tel"
                className={inputClass()}
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saveState === "saving"}
                className="flex items-center gap-2 rounded-lg bg-aubergine text-cream text-sm font-medium px-6 py-3 hover:bg-aubergine-light transition-colors disabled:opacity-60"
              >
                <Save size={16} />
                {saveState === "saving" ? "Saving..." : "Save Changes"}
              </button>
              {saveState === "saved" && (
                <span className="text-sm text-magenta-deep">Saved.</span>
              )}
              {saveState === "saved-pending-email" && (
                <span className="text-sm text-magenta-deep">
                  Saved — check your new email to confirm the change.
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
          {orders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-aubergine/20 py-16 text-center">
              <Package className="mx-auto text-aubergine/30 mb-3" size={32} />
              <p className="text-charcoal-soft mb-6">
                No orders yet — once you check out, they&apos;ll show up
                here.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center rounded-lg bg-aubergine text-cream text-sm font-medium px-6 py-3 hover:bg-aubergine-light transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl border border-aubergine/10 p-5"
                >
                  <div>
                    <p className="font-display text-base text-aubergine">
                      #{order.orderNumber}
                    </p>
                    <p className="text-xs text-charcoal-soft mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      • {order.itemCount}{" "}
                      {order.itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-aubergine">
                      {formatNaira(order.total)}
                    </p>
                    <p className="text-xs text-charcoal-soft mt-1">
                      {STATUS_LABEL[order.status] ?? order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
