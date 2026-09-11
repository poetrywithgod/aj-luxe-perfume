import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { prisma, withDbRetry } from "db";
import { getCurrentCustomer } from "@/lib/auth";
import { ProductCard } from "@/components/ProductCard";
import { AddToCartControl } from "@/components/product/AddToCartControl";
import { ReviewCarousel } from "@/components/product/ReviewCarousel";
import { ReviewForm } from "@/components/product/ReviewForm";
import { formatNaira } from "@/lib/format";
import { SITE_URL } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Product.description is a single free-text field (no dedicated "highlights"
// list in the schema yet). Until that exists, derive up to 3 short bullet
// points from it as a reasonable stand-in for the curated feature list in
// the design — replace with real per-product highlights once that field
// exists.
function highlightsFrom(description: string): string[] {
  return description
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await withDbRetry(() =>
    prisma.product.findUnique({ where: { slug } }),
  );
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} | AJ Luxe Perfume`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await withDbRetry(() =>
    prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        reviews: {
          where: { status: "CONFIRMED" },
          include: { customer: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
  );

  if (!product) notFound();

  const ratings = product.reviews.map((r) => r.rating);
  const avgRating = ratings.length
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;

  const relatedProducts = await withDbRetry(() =>
    prisma.product.findMany({
      where: {
        id: { not: product.id },
        ...(product.categoryId && { categoryId: product.categoryId }),
      },
      include: {
        brand: true,
        reviews: { where: { status: "CONFIRMED" }, select: { rating: true } },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  );

  const highlights = highlightsFrom(product.description);

  const reviewItems = product.reviews.map((r) => ({
    id: r.id,
    name: r.customer ? `${r.customer.firstName} ${r.customer.lastName}` : "Guest",
    rating: r.rating,
    comment: r.comment,
  }));

  const customer = await getCurrentCustomer();
  const myReview = customer
    ? await withDbRetry(() =>
        prisma.review.findUnique({
          where: {
            productId_customerId: { productId: product.id, customerId: customer.id },
          },
          select: { rating: true, comment: true, status: true },
        }),
      )
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: product.price.toString(),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/product/${product.slug}`,
    },
    ...(ratings.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        reviewCount: ratings.length,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-charcoal-soft mb-6">
        <Link href="/" className="hover:text-aubergine transition-colors">
          Home
        </Link>
        {product.category && (
          <>
            <span className="mx-2">›</span>
            <Link
              href={`/shop/${product.category.slug}`}
              className="hover:text-aubergine transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span className="mx-2">›</span>
        <span className="text-charcoal font-medium">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="rounded-2xl border border-aubergine/10 bg-linear-to-br from-white to-lavender-light/40 p-8">
          <div className="aspect-square rounded-xl overflow-hidden bg-charcoal/5">
            {product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-24 h-40 rounded-t-full rounded-b bg-linear-to-b from-white to-lavender/60" />
              </div>
            )}
          </div>
        </div>

        <div>
          {product.brand && (
            <p className="text-sm font-medium tracking-wide text-magenta-deep uppercase">
              {product.brand.name}
            </p>
          )}
          <h1 className="font-display text-4xl sm:text-5xl text-aubergine mt-2">
            {product.name}
          </h1>

          {ratings.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(avgRating)
                        ? "fill-gold text-gold"
                        : "fill-transparent text-gold/30"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-charcoal-soft">
                {ratings.length} {ratings.length === 1 ? "Review" : "Reviews"}
              </span>
            </div>
          )}

          <p className="font-display text-3xl font-medium text-aubergine mt-6">
            {formatNaira(product.price.toNumber())}
          </p>

          {highlights.length > 0 && (
            <ul className="mt-6 space-y-3">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-base text-charcoal/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-aubergine mt-2.5 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-10">
            <AddToCartControl
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price.toNumber()}
              image={product.images[0]}
              volumeMl={product.volumeMl}
            />
          </div>
        </div>
      </div>

      <div className="mt-16 grid md:grid-cols-2 gap-12 pt-12 border-t border-aubergine/10">
        <div>
          <h2 className="font-display text-2xl text-aubergine mb-6">
            Reviews on this Perfume
          </h2>
          {reviewItems.length === 0 ? (
            <p className="text-sm text-charcoal-soft">
              No reviews yet — be the first to share your experience.
            </p>
          ) : (
            <ReviewCarousel reviews={reviewItems} />
          )}
          <ReviewForm
            productId={product.id}
            isLoggedIn={Boolean(customer)}
            existingReview={myReview}
          />
        </div>

        <div>
          <h2 className="font-display text-2xl text-aubergine mb-6">
            Additional Information
          </h2>
          <ul className="bg-white rounded-xl border border-aubergine/10 shadow-sm p-8 space-y-5 text-base text-charcoal/80">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-aubergine mt-2.5 shrink-0" />
              Bottle Size: {product.volumeMl}ml ({(product.volumeMl / 29.57).toFixed(1)} oz)
            </li>
            {/*
              The three items below aren't backed by real per-product data
              yet (no weight/material/look fields on Product) — generic
              copy as a placeholder until those exist.
            */}
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-aubergine mt-2.5 shrink-0" />
              Estimated Weight (with packaging): ~1kg
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-aubergine mt-2.5 shrink-0" />
              Material: Thick glass bottle
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-aubergine mt-2.5 shrink-0" />
              Look: Feminine, classy, eye-catching
            </li>
          </ul>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-aubergine/10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl text-aubergine">
              You May Also Like
            </h2>
            <Link
              href="/shop"
              className="text-sm text-[#1E88E5] hover:underline"
            >
              Continue shopping »
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => {
              const relRatings = p.reviews.map((r) => r.rating);
              const relAvg = relRatings.length
                ? relRatings.reduce((a, b) => a + b, 0) / relRatings.length
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
                  rating={relAvg}
                  reviewCount={relRatings.length}
                />
              );
            })}
          </div>
        </div>
      )}
      </div>
    </>
  );
}
