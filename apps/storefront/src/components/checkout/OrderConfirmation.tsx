import Link from "next/link";
import { Check, Package, Truck, Home, Mail, MapPin, HelpCircle } from "lucide-react";
import { formatNaira } from "@/lib/format";

export type ConfirmedOrderItem = {
  productId: string;
  name: string;
  image?: string;
  volumeMl?: number | null;
  qty: number;
  priceEach: number;
};

export type ConfirmedOrder = {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: ConfirmedOrderItem[];
};

type RecommendedProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
};

const DELIVERY_STOPS = [
  { key: "placed", label: "Order Placed" },
  { key: "preparing", label: "Preparing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
] as const;

// Maps the real OrderStatus enum onto a position along the 4-stop
// tracker above (CANCELLED has no natural spot on a forward-progress
// bar, so it's handled separately by the caller instead of here).
const STATUS_STOP_INDEX: Record<string, number> = {
  PENDING: 0,
  PREPARING: 1,
  SHIPPED: 2,
  DELIVERED: 3,
};

function DeliveryStatus({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-8 mb-8 text-center">
        <p className="font-display text-lg text-red-500">
          This order was cancelled.
        </p>
      </div>
    );
  }

  const currentStopIndex = STATUS_STOP_INDEX[status] ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-aubergine/10 shadow-sm p-8 mb-8">
      <h2 className="font-display text-xl text-aubergine text-center mb-10">
        Delivery Status
      </h2>
      <div className="relative flex items-start justify-between max-w-2xl mx-auto">
        <div className="absolute left-6 right-6 top-6 h-0.5 bg-aubergine/5" />
        <div
          className="absolute left-6 top-6 h-0.5 bg-magenta-deep transition-all"
          style={{
            width: `calc(${
              (currentStopIndex / (DELIVERY_STOPS.length - 1)) * 100
            }% - 24px)`,
          }}
        />
        {DELIVERY_STOPS.map((stop, i) => {
          const done = i < currentStopIndex;
          const current = i === currentStopIndex;
          const Icon =
            i === 0 ? Check : i === 1 ? Package : i === 2 ? Truck : Home;
          return (
            <div
              key={stop.key}
              className="relative z-10 flex flex-col items-center gap-3 w-1/4"
            >
              <span
                className={`w-12 h-12 rounded-full border-4 border-cream shadow-sm flex items-center justify-center ${
                  done
                    ? "bg-magenta-deep text-white"
                    : current
                      ? "bg-aubergine text-cream"
                      : "bg-cream text-charcoal-soft"
                }`}
              >
                <Icon size={20} />
              </span>
              <span className="text-center">
                <span
                  className={`block text-sm font-medium ${
                    done || current ? "text-aubergine" : "text-charcoal-soft"
                  }`}
                >
                  {stop.label}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function volumeLabel(item: ConfirmedOrderItem) {
  return item.volumeMl ? `Qty: ${item.qty} • ${item.volumeMl}ml` : `Qty: ${item.qty}`;
}

export function OrderConfirmation({
  order,
  recommended,
}: {
  order: ConfirmedOrder;
  recommended: RecommendedProduct[];
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <div className="flex justify-center mb-8">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-gold/20 blur-md" />
          <span className="relative w-20 h-20 rounded-full bg-aubergine shadow-lg shadow-aubergine/30 flex items-center justify-center">
            <Check size={40} className="text-cream" strokeWidth={3} />
          </span>
        </div>
      </div>

      <h1 className="font-display text-5xl text-aubergine text-center mb-4">
        Order Confirmed
      </h1>
      <p className="text-lg text-charcoal-soft text-center mb-12">
        Thank you for your purchase. Your fragrance journey begins here.
      </p>

      <DeliveryStatus status={order.status} />

      <div className="grid md:grid-cols-[1fr_320px] gap-8 mb-12" id="order-details">
        <div className="bg-white rounded-2xl border border-aubergine/10 shadow-sm p-8">
          <div className="flex items-center justify-between border-b border-aubergine/10 pb-6 mb-6">
            <div>
              <p className="text-sm text-charcoal-soft">Order Number</p>
              <p className="font-display text-2xl text-aubergine mt-1">
                #{order.orderNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-charcoal-soft">Total Paid</p>
              <p className="font-display text-2xl font-semibold text-aubergine mt-1">
                {formatNaira(order.total)}
              </p>
            </div>
          </div>

          <h2 className="font-display text-lg text-aubergine mb-4">
            Items in this order
          </h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 rounded-xl border border-aubergine/5 bg-cream/20 p-4"
              >
                <div className="w-16 h-16 rounded-lg bg-lavender-light/50 overflow-hidden shrink-0">
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
                  <p className="font-display text-base font-medium text-aubergine truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-charcoal-soft">
                    {volumeLabel(item)}
                  </p>
                </div>
                <p className="text-base font-medium text-aubergine whitespace-nowrap">
                  {formatNaira(item.priceEach * item.qty)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-aubergine/10 shadow-sm p-6 flex gap-4">
            <span className="w-11 h-11 rounded-full bg-aubergine/5 flex items-center justify-center shrink-0">
              <Mail size={20} className="text-aubergine" />
            </span>
            <div>
              <p className="font-display font-medium text-aubergine">
                Check your email
              </p>
              <p className="text-sm text-charcoal-soft mt-1">
                We&apos;ve sent your receipt and order details.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-aubergine/10 shadow-sm p-6 flex gap-4">
            <span className="w-11 h-11 rounded-full bg-aubergine/5 flex items-center justify-center shrink-0">
              <MapPin size={20} className="text-aubergine" />
            </span>
            <div>
              <p className="font-display font-medium text-aubergine">
                Track your order
              </p>
              <p className="text-sm text-charcoal-soft mt-1">
                You&apos;ll receive tracking info once shipped.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-aubergine/10 shadow-sm p-6 flex gap-4">
            <span className="w-11 h-11 rounded-full bg-aubergine/5 flex items-center justify-center shrink-0">
              <HelpCircle size={20} className="text-aubergine" />
            </span>
            <div>
              <p className="font-display font-medium text-aubergine">
                Need help?
              </p>
              {/* No support page exists yet — points at the WhatsApp
                  contact already used elsewhere on the site. */}
              <a
                href="https://wa.me/2349070548182"
                className="text-sm text-gold hover:underline mt-1 inline-block"
              >
                Contact our support team
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-16">
        <Link
          href="/shop"
          className="rounded-lg bg-aubergine text-cream text-base font-medium px-8 py-3.5 shadow-lg shadow-aubergine/20 hover:bg-aubergine-light transition-colors"
        >
          Continue Shopping
        </Link>
        <a
          href="#order-details"
          className="rounded-lg border border-aubergine px-8 py-3.5 text-base font-medium text-aubergine hover:bg-lavender-light/50 transition-colors"
        >
          View Order Details
        </a>
      </div>

      {recommended.length > 0 && (
        <div>
          <h2 className="font-display text-2xl text-aubergine text-center mb-8">
            Recommended For You
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {recommended.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group text-center"
              >
                <div className="aspect-[3/4] rounded-xl bg-lavender-light/50 overflow-hidden mb-3">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : null}
                </div>
                <p className="font-display font-medium text-aubergine">
                  {p.name}
                </p>
                <p className="text-sm text-charcoal-soft mt-1">
                  {formatNaira(p.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
