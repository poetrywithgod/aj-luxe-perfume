"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Building2,
  Truck,
  Zap,
  ShieldCheck,
  Mail,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/format";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";

type Method = "card" | "bank-transfer";

export default function PaymentMethodPage() {
  const { items, subtotal } = useCart();
  const [method, setMethod] = useState<Method>("bank-transfer");
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Same flat placeholder used on the checkout (shipping) page — no real
  // rate calculation exists yet.
  const shipping = items.length > 0 ? 500 : 0;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <CheckoutStepper currentStep={2} />
      <h1 className="font-display text-3xl text-aubergine mb-8">
        Payment Method
      </h1>

      <div className="space-y-4 mb-8">
        <button
          type="button"
          onClick={() => setMethod("card")}
          className={`w-full flex items-center gap-4 rounded-xl border-[1.6px] bg-white p-6 text-left transition-colors ${
            method === "card"
              ? "border-aubergine shadow-sm"
              : "border-aubergine/10"
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full border-[1.6px] shrink-0 flex items-center justify-center ${
              method === "card" ? "border-magenta-deep" : "border-aubergine/30"
            }`}
          >
            {method === "card" && (
              <span className="w-2.5 h-2.5 rounded-full bg-magenta-deep" />
            )}
          </span>
          <CreditCard className="text-aubergine/60 shrink-0" size={20} />
          <span className="flex-1">
            <span className="block font-display font-medium text-charcoal">
              Pay with Card
            </span>
            <span className="block text-xs text-charcoal-soft mt-1">
              Debit or Credit card (Visa, Verve or Mastercard)
            </span>
          </span>
          <span className="hidden sm:flex items-center gap-2 shrink-0">
            <span className="rounded-sm bg-white px-2 py-1 text-[10px] font-bold italic text-[#1434CB] border border-charcoal/10">
              VISA
            </span>
            <span className="w-6 h-4 rounded-full bg-[#EB001B] -mr-2" />
            <span className="w-6 h-4 rounded-full bg-[#F79E1B] opacity-80" />
            <span className="rounded-sm bg-[#DC2626] px-2 py-1 text-[10px] font-bold text-white ml-2">
              Verve
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMethod("bank-transfer")}
          className={`w-full flex items-center gap-4 rounded-xl border-[1.6px] bg-white p-6 text-left transition-colors ${
            method === "bank-transfer"
              ? "border-aubergine shadow-sm"
              : "border-aubergine/10"
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full border-[1.6px] shrink-0 flex items-center justify-center ${
              method === "bank-transfer"
                ? "border-magenta-deep"
                : "border-aubergine/30"
            }`}
          >
            {method === "bank-transfer" && (
              <span className="w-2.5 h-2.5 rounded-full bg-magenta-deep" />
            )}
          </span>
          <Building2 className="text-magenta-deep shrink-0" size={20} />
          <span className="flex-1">
            <span className="block font-display font-medium text-aubergine">
              Pay with Bank Transfer
            </span>
            <span className="block text-xs text-charcoal-soft mt-1">
              Secure transfer via Paystack
            </span>
          </span>
        </button>

        {/*
          Disabled: "Port Harcourt only" is a static hint here, not wired to
          the delivery-location value collected on the previous checkout
          step — there's no shared state persisting form answers across
          checkout pages yet, so this can't actually gate on the real
          answer. Treat as visual-only until that's built.
        */}
        <div className="w-full flex items-center gap-4 rounded-xl border border-aubergine/10 bg-cream/30 p-6 opacity-60 cursor-not-allowed">
          <span className="w-5 h-5 rounded-full border-[1.6px] border-aubergine/30 shrink-0" />
          <Truck className="text-aubergine/60 shrink-0" size={20} />
          <span className="flex-1">
            <span className="block font-display font-medium text-charcoal">
              Pay on Delivery
            </span>
            <span className="block text-xs text-charcoal-soft mt-1">
              Pay when you receive your order
            </span>
          </span>
          <span className="rounded-full bg-aubergine/5 px-3 py-1 text-[10px] font-medium text-aubergine shrink-0">
            Port Harcourt only
          </span>
        </div>
      </div>

      {method === "bank-transfer" ? (
        <div className="bg-white rounded-xl border border-aubergine/10 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
            <h2 className="font-display text-xl text-aubergine">
              Paystack Bank Transfer
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-magenta-light/10 px-3 py-1 text-xs font-medium text-magenta-deep">
              <Zap size={12} />
              Usually under 60s
            </span>
          </div>
          <p className="text-sm text-charcoal-soft mb-6">
            You will be redirected to Paystack to complete your bank transfer
            securely.
          </p>

          <ul className="space-y-3 mb-6">
            {[
              { icon: Zap, text: "Instant payment confirmation" },
              { icon: ShieldCheck, text: "Secure encryption for all transactions" },
              { icon: Mail, text: "Quick order confirmation via email" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-md bg-aubergine/5 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-aubergine" />
                </span>
                <span className="text-sm text-charcoal">{text}</span>
              </li>
            ))}
          </ul>

          {/*
            No Paystack integration exists yet — this simply advances to a
            placeholder route. Real integration needs a server route to
            create the Paystack transaction before redirecting.
          */}
          <Link
            href="/checkout/confirmation"
            className="flex items-center justify-center gap-2 rounded-lg bg-aubergine text-cream text-base font-medium py-4 hover:bg-aubergine-light transition-colors"
          >
            Click Here to Continue
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-aubergine/10 shadow-sm p-6 sm:p-8 mb-8">
          {/*
            No card-payment field layout was specified yet — kept
            deliberately minimal rather than inventing a card-number/CVV
            form that might not match a future design.
          */}
          <p className="text-sm text-charcoal-soft mb-6">
            You&apos;ll securely enter your card details on the next step.
          </p>
          <Link
            href="/checkout/confirmation"
            className="flex items-center justify-center gap-2 rounded-lg bg-aubergine text-cream text-base font-medium py-4 hover:bg-aubergine-light transition-colors"
          >
            Click Here to Continue
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      <div className="border-t border-aubergine/10 pt-6 mb-6">
        <Link
          href="/checkout"
          className="inline-block rounded-lg border border-aubergine px-8 py-3.5 text-base font-medium text-aubergine hover:bg-lavender-light/50 transition-colors"
        >
          Back to Shipping
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-aubergine/10 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setSummaryOpen((o) => !o)}
          className="w-full flex items-center justify-between p-4"
        >
          <span className="flex items-baseline gap-2">
            <span className="font-display text-lg text-aubergine">
              Order Summary
            </span>
            <span className="text-sm text-charcoal-soft">
              ({items.length} {items.length === 1 ? "item" : "items"})
            </span>
          </span>
          <span className="flex items-center gap-2">
            <span className="font-medium text-aubergine">
              {formatNaira(total)}
            </span>
            <ChevronDown
              size={18}
              className={`text-charcoal-soft transition-transform ${
                summaryOpen ? "rotate-180" : ""
              }`}
            />
          </span>
        </button>
        {summaryOpen && (
          <div className="border-t border-aubergine/10 p-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-charcoal">
                  {item.name} × {item.qty}
                </span>
                <span className="text-aubergine font-medium">
                  {formatNaira(item.price * item.qty)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm text-charcoal-soft pt-2 border-t border-aubergine/10">
              <span>Shipping</span>
              <span>{formatNaira(shipping)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
