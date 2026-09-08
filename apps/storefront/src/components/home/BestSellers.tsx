import Link from "next/link";
import { prisma, withDbRetry } from "db";
import { ProductCard } from "@/components/ProductCard";

export async function BestSellers() {
  const products = await withDbRetry(() =>
    prisma.product.findMany({
      where: { isBestSeller: true },
      include: {
        brand: true,
        reviews: { where: { status: "CONFIRMED" }, select: { rating: true } },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  );

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="flex items-end justify-between mb-8">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-aubergine">
          Best Sellers
        </h2>
        <Link
          href="/shop"
          className="text-sm font-medium text-aubergine hover:text-magenta transition-colors"
        >
          See more
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-charcoal/20 py-16 text-center">
          <p className="text-charcoal-soft max-w-sm mx-auto">
            No best sellers yet. Add products in the admin dashboard and mark
            them as best sellers to feature them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            const ratings: number[] = p.reviews.map((r) => r.rating);
            const avg = ratings.length
              ? ratings.reduce((a: number, b: number) => a + b, 0) /
                ratings.length
              : 0;
            return (
              <ProductCard
                key={p.id}
                id={p.id}
                slug={p.slug}
                name={p.name}
                brandName={p.brand?.name}
                price={p.price.toNumber()}
                image={p.images[0]}
                volumeMl={p.volumeMl}
                rating={avg}
                reviewCount={ratings.length}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
