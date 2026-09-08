"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";

type AddToCartControlProps = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  volumeMl?: number;
};

export function AddToCartControl({
  productId,
  slug,
  name,
  price,
  image,
  volumeMl,
}: AddToCartControlProps) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-xl border border-aubergine/20 bg-white">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-10 h-10 flex items-center justify-center text-aubergine hover:bg-lavender-light/60 rounded-l-xl transition-colors"
        >
          <Minus size={16} />
        </button>
        <span className="w-10 text-center text-base font-semibold text-aubergine">
          {qty}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQty((q) => q + 1)}
          className="w-10 h-10 flex items-center justify-center text-aubergine hover:bg-lavender-light/60 rounded-r-xl transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      <button
        type="button"
        onClick={() =>
          addItem({ productId, slug, name, image, price, volumeMl }, qty)
        }
        className="flex-1 rounded-xl bg-aubergine text-cream text-base font-semibold py-3.5 shadow-lg shadow-aubergine/20 hover:bg-aubergine-light transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}
