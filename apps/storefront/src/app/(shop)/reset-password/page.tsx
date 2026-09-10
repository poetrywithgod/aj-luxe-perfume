"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function inputClass() {
  return "w-full rounded-xl border border-aubergine/20 bg-white px-4 py-3 text-base outline-none focus:border-aubergine focus:ring-2 focus:ring-aubergine/10 transition";
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 sm:px-6 py-16 text-center">
        <h1 className="font-display text-3xl text-aubergine mb-4">
          Missing reset link
        </h1>
        <p className="text-charcoal-soft mb-8">
          This page needs a token from a password reset email. Please use
          the link from that email, or request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center rounded-lg bg-aubergine text-cream text-sm font-medium px-6 py-3 hover:bg-aubergine-light transition-colors"
        >
          Request Reset Link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
      <h1 className="font-display text-4xl text-aubergine text-center mb-8">
        Reset Password
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-aubergine mb-2">
            New Password
          </label>
          <input
            required
            minLength={8}
            type="password"
            name="password"
            autoComplete="new-password"
            className={inputClass()}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-aubergine mb-2">
            Confirm New Password
          </label>
          <input
            required
            minLength={8}
            type="password"
            name="confirm"
            autoComplete="new-password"
            className={inputClass()}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-aubergine text-cream text-base font-medium py-3.5 hover:bg-aubergine-light transition-colors disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
