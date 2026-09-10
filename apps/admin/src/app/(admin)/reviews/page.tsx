import { prisma, withDbRetry } from "db";
import { ReviewModerationList } from "@/components/ReviewModerationList";

export const metadata = { title: "Reviews" };

export default async function ReviewsPage() {
  const [pending, recent] = await Promise.all([
    withDbRetry(() =>
      prisma.review.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
        include: {
          product: { select: { name: true, slug: true } },
          customer: { select: { firstName: true, lastName: true } },
        },
      }),
    ),
    withDbRetry(() =>
      prisma.review.findMany({
        where: { status: { in: ["CONFIRMED", "REJECTED"] } },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          product: { select: { name: true, slug: true } },
          customer: { select: { firstName: true, lastName: true } },
        },
      }),
    ),
  ]);

  const toItem = (r: (typeof pending)[number]) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
    productName: r.product.name,
    productSlug: r.product.slug,
    customerName: r.customer
      ? `${r.customer.firstName} ${r.customer.lastName}`
      : "Guest",
  });

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-10">
      <h1 className="text-2xl font-semibold text-aubergine mb-1">Reviews</h1>
      <p className="text-sm text-charcoal-soft mb-8">
        New reviews wait here until approved or rejected — only approved
        reviews show on the product page.
      </p>

      <ReviewModerationList
        initialPending={pending.map(toItem)}
        recent={recent.map(toItem)}
      />
    </div>
  );
}
