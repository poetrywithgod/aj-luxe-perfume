"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Minus, Plus } from "lucide-react";
import { formatNaira } from "@/lib/format";

type ProductCardProps = {
  slug: string;
  name: string;
  brandName?: string;
  price: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
};

export function ProductCard({
  slug,
  name,
  brandName,
  price,
  image,
  rating = 0,
  reviewCount = 0,
}: ProductCardProps) {
  // Local, per-card quantity state only — not yet wired to a real cart
  // (no cart context/API exists yet). This just mirrors the add-to-cart
  // → quantity-stepper interaction from the reference design.
  const [qty, setQty] = useState(0);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group bg-white rounded-2xl border border-charcoal/8 overflow-hidden"
    >
      <Link href={`/product/${slug}`} className="block">
        <div className="aspect-square bg-lavender-light/50 relative overflow-hidden">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-10 h-16 rounded-t-full rounded-b bg-gradient-to-b from-white to-lavender/60" />
            </div>
          )}
        </div>
        <div className="p-4">
          {brandName && (
            <p className="text-xs text-charcoal-soft mb-0.5">{brandName}</p>
          )}
          <h3 className="font-display text-lg font-medium text-charcoal leading-snug">
            {name}
          </h3>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={
                    i < Math.round(rating)
                      ? "fill-gold text-gold"
                      : "fill-transparent text-charcoal/20"
                  }
                />
              ))}
              <span className="text-xs text-charcoal-soft ml-1">
                ({reviewCount})
              </span>
            </div>
          )}
          <p className="mt-2 font-medium text-aubergine">
            {formatNaira(price)}
          </p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        {qty > 0 ? (
          <div className="flex items-center justify-between rounded-full border border-charcoal/15">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQty((q) => Math.max(0, q - 1))}
              className="w-10 h-10 flex items-center justify-center text-charcoal hover:text-aubergine transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="text-sm font-semibold text-charcoal">{qty}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQty((q) => q + 1)}
              className="w-10 h-10 flex items-center justify-center text-charcoal hover:text-aubergine transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setQty(1)}
            className="w-full rounded-full bg-aubergine text-cream text-sm font-semibold py-2.5 hover:bg-aubergine-light transition-colors"
          >
            Add to Cart
          </button>
        )}
      </div>
    </motion.div>
  );
}
