import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma, withDbRetry } from "db";
import { OrderConfirmation, type ConfirmedOrder } from "@/components/checkout/OrderConfirmation";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;

  // The payment step now creates a real Order via /api/orders and links
  // here with ?order=<id> — if that id is missing or doesn't resolve
  // (direct nav, stale/shared link), there's no real order to show.
  if (!orderId) {
    notFound();
  }

  const order = await withDbRetry(() =>
    prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    }),
  );

  if (!order) {
    notFound();
  }

  const confirmedOrder: ConfirmedOrder = {
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total.toNumber(),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      image: item.product.images[0],
      volumeMl: item.product.volumeMl,
      qty: item.quantity,
      priceEach: item.priceEach.toNumber(),
    })),
  };

  // No order-based recommendation logic exists yet — best sellers are a
  // reasonable stand-in, same as before.
  const products = await withDbRetry(() =>
    prisma.product.findMany({
      where: { isBestSeller: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  );

  const recommended = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price.toNumber(),
    image: p.images[0],
  }));

  return <OrderConfirmation order={confirmedOrder} recommended={recommended} />;
}
