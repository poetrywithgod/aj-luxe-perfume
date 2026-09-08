"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type ReviewItem = {
  id: string;
  name: string;
  rating: number;
  comment: string;
};

const PER_PAGE = 2;

export function ReviewCarousel({ reviews }: { reviews: ReviewItem[] }) {
  const pageCount = Math.max(1, Math.ceil(reviews.length / PER_PAGE));
  const [page, setPage] = useState(0);

  const visible = reviews.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div>
      <div className="space-y-4">
        {visible.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl border border-aubergine/10 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-display font-medium text-aubergine">
                {r.name}
              </p>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < r.rating
                        ? "fill-gold text-gold"
                        : "fill-transparent text-gold/30"
                    }
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              {r.comment}
            </p>
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show reviews page ${i + 1}`}
              aria-current={i === page}
              onClick={() => setPage(i)}
              className={`h-2 rounded-full transition-all ${
                i === page ? "w-4 bg-aubergine" : "w-2 bg-aubergine/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
