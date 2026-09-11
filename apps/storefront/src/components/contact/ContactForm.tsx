"use client";

import { useState } from "react";

function inputClass() {
  return "w-full rounded-xl border border-aubergine/20 bg-white px-4 py-3 text-base outline-none focus:border-aubergine focus:ring-2 focus:ring-aubergine/10 transition";
}

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message"),
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-aubergine/10 bg-white px-6 py-10 text-center">
        <p className="font-display text-2xl text-aubergine mb-2">
          Message sent
        </p>
        <p className="text-charcoal-soft text-sm">
          Thanks for reaching out — we&apos;ll get back to you soon, usually
          within a day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-aubergine/10 bg-white px-6 sm:px-8 py-8 space-y-5"
    >
      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-aubergine mb-2">
          Name
        </label>
        <input required name="name" type="text" className={inputClass()} />
      </div>

      <div>
        <label className="block text-sm font-medium text-aubergine mb-2">
          Email Address
        </label>
        <input required name="email" type="email" className={inputClass()} />
      </div>

      <div>
        <label className="block text-sm font-medium text-aubergine mb-2">
          Message
        </label>
        <textarea
          required
          name="message"
          rows={5}
          className={`${inputClass()} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto rounded-full bg-aubergine text-cream text-sm font-semibold px-8 py-3.5 hover:bg-aubergine-light transition-colors disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
