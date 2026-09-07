"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

type ProductCardProps = {
  slug: string;
  name: string;
  brandName?: string;
  price: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
};

function formatNaira(amount: number) {
  return `NGN ${amount.toLocaleString("en-NG")}`;
}

export function ProductCard({
  slug,
  name,
  brandName,
  price,
  image,
  rating = 0,
  reviewCount = 0,
}: ProductCardProps) {
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
        <button
          type="button"
          className="w-full rounded-full bg-aubergine text-cream text-sm font-semibold py-2.5 hover:bg-aubergine-light transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
