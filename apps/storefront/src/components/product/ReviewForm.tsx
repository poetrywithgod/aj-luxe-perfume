"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

export type ExistingReview = {
  rating: number;
  comment: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
};

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const n = i + 1;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            className="p-0.5"
          >
            <Star
              size={24}
              className={
                n <= value
                  ? "fill-gold text-gold"
                  : "text-charcoal/20 hover:text-charcoal/40 transition-colors"
              }
            />
          </button>
        );
      })}
    </div>
  );
}

export function ReviewForm({
  productId,
  isLoggedIn,
  existingReview,
}: {
  productId: string;
  isLoggedIn: boolean;
  existingReview: ExistingReview | null;
}) {
  const [submitted, setSubmitted] = useState<ExistingReview | null>(
    existingReview,
  );
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) {
    return (
      <p className="text-sm text-charcoal-soft bg-lavender-light/30 rounded-xl px-4 py-3 mt-6">
        <Link href="/login" className="text-magenta-deep hover:underline">
          Log in
        </Link>{" "}
        to write a review.
      </p>
    );
  }

  if (submitted) {
    const message =
      submitted.status === "CONFIRMED"
        ? "Your review is published above."
        : submitted.status === "REJECTED"
          ? "Your review wasn't approved for publishing."
          : "Thanks — your review is waiting for approval before it appears here.";
    return (
      <div className="rounded-xl border border-aubergine/10 bg-white px-4 py-4 mt-6">
        <p className="text-sm font-medium text-aubergine mb-1">
          Your Review
        </p>
        <div className="flex items-center gap-0.5 mb-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < submitted.rating
                  ? "fill-gold text-gold"
                  : "text-charcoal/15"
              }
            />
          ))}
        </div>
        <p className="text-sm text-charcoal">{submitted.comment}</p>
        <p className="text-xs text-charcoal-soft mt-2">{message}</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (comment.trim().length < 5) {
      setError("Please write a few words about your experience.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, comment }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSubmitted({ rating, comment, status: "PENDING" });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-aubergine/10 bg-white px-4 py-5 mt-6 space-y-4"
    >
      <p className="text-sm font-medium text-aubergine">Write a Review</p>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <StarPicker value={rating} onChange={setRating} />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Share your experience with this fragrance..."
        className="w-full rounded-lg border border-aubergine/20 bg-cream/30 px-3 py-2.5 text-sm outline-none focus:border-aubergine focus:ring-2 focus:ring-aubergine/10 transition resize-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-aubergine text-cream text-sm font-medium px-5 py-2.5 hover:bg-aubergine-light transition-colors disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
