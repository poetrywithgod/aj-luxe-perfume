"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function inputClass() {
  return "w-full rounded-xl border border-aubergine/20 bg-white px-4 py-3 text-base outline-none focus:border-aubergine focus:ring-2 focus:ring-aubergine/10 transition";
}

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const password = form.get("password") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
        email: form.get("email"),
        phone: form.get("phone"),
        password,
      }),
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
        Create Account
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-aubergine mb-2">
              First Name
            </label>
            <input
              required
              name="firstName"
              placeholder="Jane"
              className={inputClass()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-aubergine mb-2">
              Last Name
            </label>
            <input
              required
              name="lastName"
              placeholder="Doe"
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
            type="email"
            name="email"
            autoComplete="email"
            placeholder="example@gmail.com"
            className={inputClass()}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-aubergine mb-2">
            Phone Number
          </label>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+234..."
            className={inputClass()}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-aubergine mb-2">
            Password
          </label>
          <input
            required
            minLength={8}
            type="password"
            name="password"
            autoComplete="new-password"
            className={inputClass()}
          />
          <p className="text-xs text-charcoal-soft mt-1.5">
            At least 8 characters.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-aubergine mb-2">
            Confirm Password
          </label>
          <input
            required
            minLength={8}
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            className={inputClass()}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-aubergine text-cream text-base font-medium py-3.5 hover:bg-aubergine-light transition-colors disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-charcoal-soft mt-8">
        Already have an account?{" "}
        <Link href="/login" className="text-magenta-deep hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
