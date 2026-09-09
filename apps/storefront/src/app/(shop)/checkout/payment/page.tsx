"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  Lock,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useCheckout } from "@/lib/checkout-context";
import { formatNaira } from "@/lib/format";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";

type Method = "card" | "bank-transfer";

const CARD_FORM_ID = "card-details-form";

function inputClass() {
  return "w-full rounded-lg border border-aubergine/20 bg-white px-4 py-3 text-base outline-none focus:border-aubergine focus:ring-2 focus:ring-aubergine/10 transition placeholder:text-[#9CA3AF]";
}

export default function PaymentMethodPage() {
  const router = useRouter();
  const { items, subtotal, clear: clearCart } = useCart();
  const { shipping, hydrated, clearShipping } = useCheckout();
  const [method, setMethod] = useState<Method>("bank-transfer");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Same flat placeholder used on the checkout (shipping) page — no real
  // rate calculation exists yet.
  const shippingFee = items.length > 0 ? 500 : 0;
  const total = subtotal + shippingFee;

  // Shipping details live in the previous checkout step and are only
  // carried over via CheckoutProvider — if they're missing (direct nav,
  // a stale bookmark, sessionStorage cleared) there's nothing valid to
  // submit an order with, so send the person back to fill them in.
  useEffect(() => {
    if (hydrated && !shipping) {
      router.replace("/checkout");
    }
  }, [hydrated, shipping, router]);

  async function placeOrder(paymentMethod: "CARD" | "BANK_TRANSFER") {
    if (!shipping || items.length === 0) return;
    setPlacingOrder(true);
    setOrderError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
          })),
          shipping,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOrderError(data?.error ?? "Something went wrong placing your order.");
        setPlacingOrder(false);
        return;
      }
      // Order record now exists for real — safe to clear both the cart
      // and the in-progress shipping details before moving on.
      clearShipping();
      clearCart();
      router.push(`/checkout/confirmation?order=${data.id}`);
    } catch {
      setOrderError("Couldn't reach the server. Please try again.");
      setPlacingOrder(false);
    }
  }

  function handleCardSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No payment gateway wired up yet — real card processing would go
    // through Paystack's tokenized card charge here, server-side, before
    // the order should be marked paid. Never handle raw card
    // numbers/CVVs directly in production without PCI compliance in
    // place. In the meantime this still creates a real (PENDING) Order
    // record so the rest of the loop — Order History, admin Orders — has
    // something real to work with.
    void placeOrder("CARD");
  }

  function handleBankTransferContinue() {
    // Same placeholder situation as the card path above: no real
    // Paystack transaction is created/redirected to yet, but a real
    // Order record is.
    void placeOrder("BANK_TRANSFER");
  }

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
            No Paystack integration exists yet — this creates a real
            (PENDING) Order record via /api/orders and moves on to the
            confirmation page, but doesn't actually take a payment. Real
            integration needs a server route to create the Paystack
            transaction and only mark the order paid on its webhook.
          */}
          <button
            type="button"
            onClick={handleBankTransferContinue}
            disabled={placingOrder || items.length === 0}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-aubergine text-cream text-base font-medium py-4 hover:bg-aubergine-light transition-colors disabled:opacity-60"
          >
            {placingOrder ? "Placing Order..." : "Click Here to Continue"}
            {!placingOrder && <ArrowRight size={16} />}
          </button>
          {orderError && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">
              {orderError}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-aubergine/10 shadow-sm p-6 sm:p-8 mb-8">
          <h2 className="font-display text-xl text-aubergine mb-6">
            Card Details
          </h2>

          {/*
            Card fields submit through this form (id referenced by the
            "Complete Order" button down in the shared action bar via its
            `form` attribute) — no gateway wired up yet, see handleCardSubmit.
          */}
          <form id={CARD_FORM_ID} onSubmit={handleCardSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Cardholder Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="cardholderName"
                placeholder="John Doe"
                autoComplete="cc-name"
                className={inputClass()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Card Number <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="cardNumber"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                autoComplete="cc-number"
                className={`${inputClass()} font-mono tracking-wider`}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="expiry"
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                  className={`${inputClass()} font-mono`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  CVV <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  name="cvv"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="•••"
                  autoComplete="cc-csc"
                  className={`${inputClass()} font-mono`}
                />
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-charcoal-soft">
              <input
                type="checkbox"
                name="saveCard"
                className="w-4 h-4 rounded border-gold accent-aubergine"
              />
              Save card for future purchases
            </label>
          </form>

          <div className="flex items-center justify-center gap-2 border-t border-aubergine/10 mt-6 pt-4 text-xs text-charcoal-soft">
            <Lock size={14} className="text-gold" />
            Your payment is encrypted and secure
          </div>
        </div>
      )}

      {method === "card" && orderError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
          {orderError}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-aubergine/10 pt-6 mb-6">
        <Link
          href="/checkout"
          className="rounded-lg border border-aubergine px-8 py-3.5 text-base font-medium text-aubergine hover:bg-lavender-light/50 transition-colors"
        >
          Back to Shipping
        </Link>
        {method === "card" && (
          <button
            type="submit"
            form={CARD_FORM_ID}
            disabled={placingOrder}
            className="rounded-lg bg-aubergine text-cream text-base font-medium px-8 py-3.5 shadow-lg shadow-aubergine/20 hover:bg-aubergine-light transition-colors disabled:opacity-60"
          >
            {placingOrder ? "Placing Order..." : "Complete Order"}
          </button>
        )}
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
              <span>{formatNaira(shippingFee)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
