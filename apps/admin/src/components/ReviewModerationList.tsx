"use client";

import { useState } from "react";
import { Check, X, Star } from "lucide-react";

export type ReviewItem = {
  id: string;
  rating: number;
  comment: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED";
  createdAt: string;
  productName: string;
  productSlug: string;
  customerName: string;
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-gold text-gold" : "text-charcoal/15"}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: ReviewItem["status"] }) {
  const styles =
    status === "CONFIRMED"
      ? "bg-green-50 text-green-700 border-green-200"
      : status === "REJECTED"
        ? "bg-red-50 text-red-600 border-red-200"
        : "bg-gold/10 text-gold border-gold/30";
  return (
    <span
      className={`text-xs font-medium rounded-full border px-2.5 py-0.5 ${styles}`}
    >
      {status === "CONFIRMED"
        ? "Approved"
        : status === "REJECTED"
          ? "Rejected"
          : "Pending"}
    </span>
  );
}

function ReviewCard({
  review,
  onModerate,
}: {
  review: ReviewItem;
  onModerate?: (status: "CONFIRMED" | "REJECTED") => void;
}) {
  const [busy, setBusy] = useState(false);

  async function handle(status: "CONFIRMED" | "REJECTED") {
    if (!onModerate) return;
    setBusy(true);
    onModerate(status);
  }

  return (
    <div className="bg-white rounded-xl border border-aubergine/10 p-5">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="font-medium text-aubergine">{review.productName}</p>
          <p className="text-xs text-charcoal-soft mt-0.5">
            {review.customerName} ·{" "}
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <StatusBadge status={review.status} />
      </div>
      <Stars rating={review.rating} />
      <p className="text-sm text-charcoal mt-2 leading-relaxed">
        {review.comment}
      </p>

      {onModerate && (
        <div className="flex items-center gap-2 mt-4">
          <button
            type="button"
            disabled={busy}
            onClick={() => handle("CONFIRMED")}
            className="flex items-center gap-1.5 rounded-lg bg-aubergine text-cream text-xs font-medium px-3 py-2 hover:bg-aubergine-light transition-colors disabled:opacity-60"
          >
            <Check size={14} /> Approve
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => handle("REJECTED")}
            className="flex items-center gap-1.5 rounded-lg border border-charcoal/20 text-charcoal text-xs font-medium px-3 py-2 hover:bg-cream transition-colors disabled:opacity-60"
          >
            <X size={14} /> Reject
          </button>
        </div>
      )}
    </div>
  );
}

export function ReviewModerationList({
  initialPending,
  recent,
}: {
  initialPending: ReviewItem[];
  recent: ReviewItem[];
}) {
  const [pending, setPending] = useState(initialPending);
  const [error, setError] = useState<string | null>(null);

  async function moderate(id: string, status: "CONFIRMED" | "REJECTED") {
    setError(null);
    // Optimistic — the review leaves the pending queue immediately;
    // rolled back below if the request fails.
    const prev = pending;
    setPending((p) => p.filter((r) => r.id !== id));

    const res = await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      setPending(prev);
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Couldn't update that review. Please try again.");
    }
  }

  return (
    <div className="space-y-10">
      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <section>
        <h2 className="text-sm font-medium text-charcoal-soft mb-3">
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-charcoal-soft bg-white rounded-xl border border-aubergine/10 px-5 py-6 text-center">
            No reviews waiting for approval.
          </p>
        ) : (
          <div className="space-y-3">
            {pending.map((r) => (
              <ReviewCard
                key={r.id}
                review={r}
                onModerate={(status) => moderate(r.id, status)}
              />
            ))}
          </div>
        )}
      </section>

      {recent.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-charcoal-soft mb-3">
            Recently Moderated
          </h2>
          <div className="space-y-3">
            {recent.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
