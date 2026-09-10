"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function inputClass() {
  return "w-full rounded-xl border border-aubergine/20 bg-white px-4 py-3 text-base outline-none focus:border-aubergine focus:ring-2 focus:ring-aubergine/10 transition";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="font-semibold text-3xl text-aubergine text-center mb-1">
          AJ Luxe Perfume
        </h1>
        <p className="text-center text-sm text-charcoal-soft mb-8">
          Admin Dashboard
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-aubergine/10 shadow-sm p-8 space-y-6"
        >
          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-aubergine mb-2">
              Email Address
            </label>
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              className={inputClass()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-aubergine mb-2">
              Password
            </label>
            <input
              required
              type="password"
              name="password"
              autoComplete="current-password"
              className={inputClass()}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-aubergine text-cream text-base font-medium py-3.5 hover:bg-aubergine-light transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
