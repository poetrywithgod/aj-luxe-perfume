"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/format";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";

const POLICY_NOTES = [
  "Delivery within Port Harcourt (PH): 24-48 hours",
  "Delivery outside PH: 24-72 hours (depending on location)",
  "Delivery rates: May vary based on location",
  "Bank transfer option available during checkout",
  "Secure encryption for all transactions",
  "Quick order confirmation via email",
];

export default function CartPage() {
  const { items, setQty, removeItem, subtotal } = useCart();

  // No coupon/discount system exists yet — this stays at 0 until one does.
  const discount = 0;
  const total = subtotal - discount;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <CheckoutStepper currentStep={0} />
      <h1 className="font-display text-4xl text-aubergine text-center mb-12">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-aubergine/20 py-20 text-center">
          <p className="text-charcoal-soft mb-6">Your cart is empty.</p>
          <Link
            href="/shop"
            className="inline-flex items-center rounded-full bg-aubergine px-8 py-3 text-sm font-semibold text-cream hover:bg-aubergine-light transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-2xl border border-aubergine/10 shadow-sm p-6 flex flex-wrap items-center gap-6"
              >
                <div className="w-24 h-24 rounded-xl bg-lavender-light/50 overflow-hidden shrink-0">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>

                <div className="flex-1 min-w-40">
                  <p className="font-display text-xl text-aubergine">
                    {item.name}
                  </p>
                  {/*
                    "Eau de Parfum" is a generic label — Product has no
                    fragrance-concentration field yet to pull a real one
                    from, just volumeMl.
                  */}
                  {item.volumeMl && (
                    <p className="text-sm text-charcoal-soft mt-1">
                      Eau de Parfum • {item.volumeMl}ml
                    </p>
                  )}
                  <p className="font-medium text-aubergine mt-3">
                    {formatNaira(item.price)}
                  </p>
                </div>

                <div className="flex items-center gap-6 ml-auto">
                  <div className="flex items-center rounded-lg border border-aubergine/20 bg-cream/30">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty(item.productId, item.qty - 1)}
                      className="w-8 h-8 flex items-center justify-center text-aubergine hover:bg-lavender-light/60 rounded-l-lg transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-base font-medium text-aubergine">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty(item.productId, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center text-aubergine hover:bg-lavender-light/60 rounded-r-lg transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <p className="text-sm text-charcoal-soft whitespace-nowrap">
                    Sub Total{" "}
                    <span className="font-medium text-aubergine">
                      {formatNaira(item.price * item.qty)}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => removeItem(item.productId)}
                  className="text-red-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-[#F0EBE1]/20 border border-aubergine/5 rounded-2xl p-6 mb-8">
            <ul className="space-y-3">
              {POLICY_NOTES.map((note) => (
                <li
                  key={note}
                  className="flex items-start gap-3 text-sm text-charcoal/80"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-aubergine mt-1.5 shrink-0" />
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-aubergine/10 shadow-lg shadow-aubergine/5 p-8">
            <h2 className="font-display text-2xl text-aubergine mb-6">
              Order Summary
            </h2>
            <div className="space-y-2 text-base text-charcoal">
              <div className="flex items-center justify-between">
                <span>Sub Total</span>
                <span className="font-medium">{formatNaira(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span className="font-medium text-aubergine">
                    - {formatNaira(discount)}
                  </span>
                </div>
              )}
            </div>
            <div className="border-t border-aubergine/10 mt-4 pt-4 flex items-center justify-between">
              <span className="font-display text-xl text-aubergine">
                Total
              </span>
              <span className="font-display text-2xl font-semibold text-aubergine">
                {formatNaira(total)}
              </span>
            </div>
            {/*
              Real checkout flow now exists end-to-end (shipping →
              payment → a real Order record). Coupon/discount support is
              still the one open piece — see the `discount` note above.
            */}
            <Link
              href="/checkout"
              className="mt-8 block text-center rounded-xl bg-aubergine text-cream text-base font-semibold py-3.5 shadow-lg shadow-aubergine/20 hover:bg-aubergine-light transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
