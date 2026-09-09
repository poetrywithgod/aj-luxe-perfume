import { NextResponse } from "next/server";
import { prisma, withDbRetry } from "db";
import type { PaymentMethod } from "db";
import { getSessionCustomerId } from "@/lib/auth";

// Same flat placeholder used throughout the checkout UI — no real
// shipping-rate calculation (by weight/location) exists yet.
const FLAT_SHIPPING_FEE = 500;

type OrderItemInput = { productId: string; qty: number };

type ShippingInput = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  state: string;
  city: string;
  phone: string;
  note?: string;
};

function generateOrderNumber() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AJL${Date.now().toString().slice(-6)}${rand}`;
}

function isValidPaymentMethod(value: unknown): value is PaymentMethod {
  return value === "CARD" || value === "BANK_TRANSFER" || value === "PAY_ON_DELIVERY";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { items, shipping, paymentMethod } = (body ?? {}) as {
    items?: OrderItemInput[];
    shipping?: ShippingInput;
    paymentMethod?: unknown;
  };

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (
    !shipping ||
    !shipping.firstName?.trim() ||
    !shipping.lastName?.trim() ||
    !shipping.email?.trim() ||
    !shipping.address?.trim() ||
    !shipping.state?.trim() ||
    !shipping.city?.trim() ||
    !shipping.phone?.trim()
  ) {
    return NextResponse.json({ error: "Missing shipping details" }, { status: 400 });
  }
  if (!isValidPaymentMethod(paymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }

  // Re-look-up prices/stock server-side rather than trusting whatever the
  // client sent — the cart's client-held prices are just for display.
  const productIds = items.map((i) => i.productId);
  const products = await withDbRetry(() =>
    prisma.product.findMany({ where: { id: { in: productIds } } }),
  );
  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: `Product ${item.productId} no longer exists` },
        { status: 400 },
      );
    }
    if (!Number.isFinite(item.qty) || item.qty <= 0) {
      return NextResponse.json(
        { error: `Invalid quantity for ${product.name}` },
        { status: 400 },
      );
    }
    // Stock is checked but not decremented here — decrementing inventory
    // atomically alongside order creation, and handling the admin-side
    // restock/cancellation flows, is a bigger piece than this round of
    // fixes covers. Flagged as a real gap, not an oversight.
    if (product.stock < item.qty) {
      return NextResponse.json(
        { error: `${product.name} doesn't have enough stock left` },
        { status: 409 },
      );
    }
  }

  const subtotal = items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + product.price.toNumber() * item.qty;
  }, 0);
  const shippingFee = FLAT_SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const customerId = await getSessionCustomerId(); // null for guest checkout

  const order = await withDbRetry(() =>
    prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        status: "PENDING",
        paymentMethod,
        subtotal,
        shippingFee,
        discount: 0,
        total,
        firstName: shipping.firstName.trim(),
        lastName: shipping.lastName.trim(),
        email: shipping.email.trim().toLowerCase(),
        phone: shipping.phone.trim(),
        address: shipping.address.trim(),
        state: shipping.state.trim(),
        city: shipping.city.trim(),
        customerNote: shipping.note?.trim() || null,
        customerId: customerId ?? undefined,
        items: {
          create: items.map((item) => {
            const product = productMap.get(item.productId)!;
            return {
              productId: item.productId,
              quantity: item.qty,
              priceEach: product.price,
            };
          }),
        },
      },
      select: { id: true, orderNumber: true },
    }),
  );

  return NextResponse.json(order, { status: 201 });
}
