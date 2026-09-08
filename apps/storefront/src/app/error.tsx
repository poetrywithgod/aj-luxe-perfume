"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side logging hook — replace with a real error-tracking
    // integration (Sentry, etc.) once one is wired up.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-aubergine mb-3">
          Something went wrong
        </h1>
        <p className="text-charcoal-soft mb-8">
          We couldn&apos;t load this page just now — it&apos;s usually a
          brief connection hiccup. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center rounded-full bg-aubergine px-8 py-3 text-sm font-semibold text-cream hover:bg-aubergine-light transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
