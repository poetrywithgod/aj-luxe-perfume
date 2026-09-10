"use client";

import { useState } from "react";
import Link from "next/link";

function inputClass() {
  return "w-full rounded-xl border border-aubergine/20 bg-white px-4 py-3 text-base outline-none focus:border-aubergine focus:ring-2 focus:ring-aubergine/10 transition";
}

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong. Please try again.");
      return;
    }

    // The API always returns the same generic message whether or not the
    // email matched an account — this page just displays it as-is.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-4 sm:px-6 py-16 text-center">
        <h1 className="font-display text-3xl text-aubergine mb-4">
          Check your email
        </h1>
        <p className="text-charcoal-soft mb-8">
          If an account exists for that email, we&apos;ve sent a link to
          reset your password.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center rounded-lg bg-aubergine text-cream text-sm font-medium px-6 py-3 hover:bg-aubergine-light transition-colors"
        >
          Back to Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
      <h1 className="font-display text-4xl text-aubergine text-center mb-3">
        Forgot Password
      </h1>
      <p className="text-center text-charcoal-soft mb-8">
        Enter your email and we&apos;ll send you a link to reset it.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="example@gmail.com"
            className={inputClass()}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-aubergine text-cream text-base font-medium py-3.5 hover:bg-aubergine-light transition-colors disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="text-center text-sm text-charcoal-soft mt-8">
        Remembered your password?{" "}
        <Link href="/login" className="text-magenta-deep hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
