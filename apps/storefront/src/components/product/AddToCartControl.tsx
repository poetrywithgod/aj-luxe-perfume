"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

// Local quantity state only — no real cart context/API exists yet, so this
// doesn't persist or affect the header's cart badge/subtotal. Swap in real
// cart wiring once that backend exists.
export function AddToCartControl() {
  const [qty, setQty] = useState(1);

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
        className="flex-1 rounded-xl bg-aubergine text-cream text-base font-semibold py-3.5 shadow-lg shadow-aubergine/20 hover:bg-aubergine-light transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}
