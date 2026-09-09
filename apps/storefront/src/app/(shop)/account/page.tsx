import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma, withDbRetry } from "db";
import { getCurrentCustomer } from "@/lib/auth";
import { AccountView, type OrderSummary } from "@/components/account/AccountView";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false },
};

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) {
    redirect("/login");
  }

  const orders = await withDbRetry(() =>
    prisma.order.findMany({
      where: { customerId: customer.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
  );

  const orderSummaries: OrderSummary[] = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    total: o.total.toNumber(),
    createdAt: o.createdAt.toISOString(),
    itemCount: o.items.reduce((sum, item) => sum + item.quantity, 0),
  }));

  return <AccountView customer={customer} orders={orderSummaries} />;
}
