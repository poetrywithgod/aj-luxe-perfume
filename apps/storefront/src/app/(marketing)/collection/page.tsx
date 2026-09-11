import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma, withDbRetry } from "db";
import { ClosingCta } from "@/components/home/ClosingCta";

export const metadata: Metadata = {
  title: "Collection",
  description:
    "Explore AJ Luxe Perfume's fragrance collections — browse by category to find your next signature scent.",
};

export default async function CollectionPage() {
  const categories = await withDbRetry(() =>
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        products: {
          select: { images: true },
          take: 1,
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { products: true } },
      },
    }),
  );

  return (
    <div>
      <section className="bg-aubergine">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-cream">
            Our Collections
          </h1>
          <p className="mt-4 text-cream/75 max-w-xl mx-auto leading-relaxed">
            Every fragrance we carry, organized by feel — pick a collection
            to start exploring.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        {categories.length === 0 ? (
          <p className="text-center text-charcoal-soft">
            Collections are on their way — check back soon.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const image = category.products[0]?.images[0];
              return (
                <Link
                  key={category.id}
                  href={`/shop/${category.slug}`}
                  className="group relative rounded-2xl overflow-hidden bg-lavender-light/50 aspect-[4/5] flex items-end"
                >
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-magenta/20 via-lavender/30 to-transparent" />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-aubergine/80 via-aubergine/10 to-transparent" />

                  <div className="relative z-10 p-6 text-cream w-full flex items-end justify-between gap-4">
                    <div>
                      <h2 className="font-display text-2xl font-semibold">
                        {category.name}
                      </h2>
                      <p className="text-cream/70 text-sm mt-1">
                        {category._count.products}{" "}
                        {category._count.products === 1
                          ? "fragrance"
                          : "fragrances"}
                      </p>
                    </div>
                    <span className="shrink-0 w-9 h-9 rounded-full bg-cream text-aubergine flex items-center justify-center group-hover:bg-gold transition-colors">
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center rounded-full border border-aubergine px-8 py-3.5 text-sm font-semibold text-aubergine hover:bg-lavender-light/50 transition-colors"
          >
            Browse All Fragrances
          </Link>
        </div>
      </section>

      <ClosingCta />
    </div>
  );
}
