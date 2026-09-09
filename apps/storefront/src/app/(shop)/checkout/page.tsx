"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useCheckout, type ShippingDetails } from "@/lib/checkout-context";
import { formatNaira } from "@/lib/format";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

// No shipping-rate calculation exists yet (depends on delivery location,
// weight, etc. per the cart page's own policy notes) — flat placeholder
// fee until that logic is built.
const FLAT_SHIPPING_FEE = 500;

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border ${
    hasError ? "border-red-400" : "border-aubergine/20"
  } bg-white px-4 py-3 text-base outline-none focus:border-aubergine focus:ring-2 focus:ring-aubergine/10 transition placeholder:text-[#9CA3AF]`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const { setShipping } = useCheckout();
  const shippingFee = items.length > 0 ? FLAT_SHIPPING_FEE : 0;
  const total = subtotal + shippingFee;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Browser-native `required` validation already blocks submission
    // before this handler runs, so reaching here means the form is valid.
    const form = new FormData(e.currentTarget);
    const details: ShippingDetails = {
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      email: String(form.get("email") ?? ""),
      address: String(form.get("address") ?? ""),
      state: String(form.get("state") ?? ""),
      city: String(form.get("city") ?? ""),
      phone: String(form.get("phone") ?? ""),
      deliveryLocation:
        form.get("deliveryLocation") === "outside-ph"
          ? "outside-ph"
          : "within-ph",
      note: String(form.get("note") ?? ""),
    };
    // Persisted via CheckoutProvider (sessionStorage) so the payment step
    // — a separate page/navigation — still has these details to submit
    // the real order with.
    setShipping(details);
    router.push("/checkout/payment");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
      <CheckoutStepper currentStep={1} emphasizeNext />
      <h1 className="font-display text-4xl text-aubergine text-center mb-12">
        Checkout
      </h1>

      <div className="grid md:grid-cols-[1fr_400px] gap-10 items-start">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-aubergine mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="firstName"
                placeholder="John"
                className={inputClass(false)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-aubergine mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="lastName"
                placeholder="Doe"
                className={inputClass(false)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-aubergine mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="email"
              name="email"
              placeholder="example@gmail.com"
              className={inputClass(false)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-aubergine mb-2">
              Home Address <span className="text-red-500">*</span>
            </label>
            <input
              required
              name="address"
              placeholder="123 Street Name"
              className={inputClass(false)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-aubergine mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select required name="state" defaultValue="" className={inputClass(false)}>
                <option value="" disabled>
                  Select state
                </option>
                {NIGERIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-aubergine mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input required name="city" className={inputClass(false)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-aubergine mb-2">
              Phone number <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="tel"
              name="phone"
              placeholder="+234..."
              className={inputClass(false)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-aubergine mb-2">
              Delivery Location <span className="text-red-500">*</span>
            </label>
            <select
              required
              name="deliveryLocation"
              defaultValue=""
              className={inputClass(false)}
            >
              <option value="" disabled>
                Select delivery location
              </option>
              <option value="within-ph">Within Port Harcourt (PH)</option>
              <option value="outside-ph">Outside Port Harcourt</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-aubergine mb-2">
              Leave a note on your Order
            </label>
            <textarea
              name="note"
              rows={4}
              placeholder="Any special instructions..."
              className={`${inputClass(false)} resize-none`}
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-aubergine/10">
            <Link
              href="/cart"
              className="rounded-xl border border-aubergine px-8 py-3.5 text-base font-medium text-aubergine hover:bg-lavender-light/50 transition-colors"
            >
              Back
            </Link>
            <button
              type="submit"
              disabled={items.length === 0}
              className="rounded-xl bg-aubergine text-cream text-base font-medium px-8 py-3.5 shadow-lg shadow-aubergine/20 hover:bg-aubergine-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </div>
          {items.length === 0 && (
            <p className="text-sm text-charcoal-soft">
              Your cart is empty — add something before checking out.
            </p>
          )}
        </form>

        <div className="bg-white rounded-2xl border border-aubergine/10 shadow-lg shadow-aubergine/5 p-6">
          <h2 className="font-display text-2xl text-aubergine mb-6">
            Order Summary
          </h2>

          {items.length === 0 ? (
            <p className="text-sm text-charcoal-soft">Your cart is empty.</p>
          ) : (
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md border border-aubergine/10 bg-lavender-light/50 overflow-hidden shrink-0">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-medium text-aubergine truncate">
                      {item.name}
                    </p>
                    {item.volumeMl && (
                      <p className="text-xs text-charcoal-soft">
                        {item.volumeMl}ml
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-medium text-aubergine whitespace-nowrap">
                    {formatNaira(item.price * item.qty)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 text-sm text-charcoal-soft border-t border-aubergine/10 pt-4">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Shipping</span>
              <span>{formatNaira(shippingFee)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-aubergine/10 mt-4 pt-4">
            <span className="font-display text-lg text-aubergine">Total</span>
            <span className="font-display text-xl font-semibold text-aubergine">
              {formatNaira(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
