import type { Metadata } from "next";
import { prisma } from "db";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default async function OrderConfirmationPage() {
  // No real order record exists to base recommendations on yet (no order
  // history/backend), so this just pulls a few best sellers as a
  // reasonable stand-in.
  const products = await prisma.product.findMany({
    where: { isBestSeller: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  const recommended = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price.toNumber(),
    image: p.images[0],
  }));

  return <OrderConfirmation recommended={recommended} />;
}
