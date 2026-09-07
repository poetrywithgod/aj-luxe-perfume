import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "db";
import { ProductCard } from "@/components/ProductCard";
import { Filters } from "@/components/shop/Filters";
import { Pagination } from "@/components/shop/Pagination";

const PAGE_SIZE = 12;
const GENDERS = ["Men", "Women", "Children", "Unisex"] as const;

const SORT_OPTIONS = {
  newest: { label: "Newest", orderBy: { createdAt: "desc" as const } },
  "price-asc": { label: "Price: Low to High", orderBy: { price: "asc" as const } },
  "price-desc": { label: "Price: High to Low", orderBy: { price: "desc" as const } },
} as const;

type SortKey = keyof typeof SORT_OPTIONS;

type PageProps = {
  params: Promise<{ category?: string[] }>;
  searchParams: Promise<{
    gender?: string | string[];
    sort?: string;
    page?: string;
  }>;
};

function normalizeGenders(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : [value];
  return arr.filter((g): g is (typeof GENDERS)[number] =>
    (GENDERS as readonly string[]).includes(g),
  );
}

async function getCategory(slug: string | undefined) {
  if (!slug) return null;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();
  return category;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: categorySegments } = await params;
  const slug = categorySegments?.[0];
  const category = slug
    ? await prisma.category.findUnique({ where: { slug } })
    : null;

  const title = category ? category.name : "Shop All Fragrances";
  return {
    title,
    description: category
      ? `Shop authentic ${category.name.toLowerCase()} at AJ Luxe Perfume. Fast delivery across Nigeria.`
      : "Browse our full collection of authentic luxury perfumes, diffusers, body sprays, and scent candles.",
  };
}

export default async function ShopPage({ params, searchParams }: PageProps) {
  const { category: categorySegments } = await params;
  const sp = await searchParams;

  const categorySlug = categorySegments?.[0];
  const category = await getCategory(categorySlug);

  const activeGenders = normalizeGenders(sp.gender);
  const sortKey: SortKey =
    sp.sort && sp.sort in SORT_OPTIONS ? (sp.sort as SortKey) : "newest";
  const currentPage = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const where = {
    ...(category && { categoryId: category.id }),
    ...(activeGenders.length > 0 && { gender: { in: activeGenders } }),
  };

  const basePath = category ? `/shop/${category.slug}` : "/shop";

  const [products, totalCount, genderCounts] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        brand: true,
        reviews: { where: { status: "CONFIRMED" }, select: { rating: true } },
      },
      orderBy: SORT_OPTIONS[sortKey].orderBy,
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    Promise.all(
      GENDERS.map((gender) =>
        prisma.product.count({
          where: {
            ...(category && { categoryId: category.id }),
            gender,
          },
        }),
      ),
    ),
  ]);

  const counts = Object.fromEntries(
    GENDERS.map((gender, i) => [gender, genderCounts[i]]),
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-charcoal-soft mb-3">
        <Link href="/" className="hover:text-aubergine transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-aubergine transition-colors">
          Shop
        </Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <span className="text-charcoal">{category.name}</span>
          </>
        )}
      </nav>

      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-aubergine">
            {category ? category.name : "All Fragrances"}
          </h1>
          <p className="text-sm text-charcoal-soft mt-1">
            Showing {products.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
            –{Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount}{" "}
            results
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-charcoal-soft">Sort by:</span>
          {(Object.keys(SORT_OPTIONS) as SortKey[]).map((key) => {
            const query = new URLSearchParams();
            activeGenders.forEach((g) => query.append("gender", g));
            if (key !== "newest") query.set("sort", key);
            const href = query.toString()
              ? `${basePath}?${query.toString()}`
              : basePath;
            return (
              <Link
                key={key}
                href={href}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  sortKey === key
                    ? "bg-aubergine text-cream"
                    : "text-charcoal hover:bg-lavender-light"
                }`}
              >
                {SORT_OPTIONS[key].label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <Filters
          basePath={basePath}
          activeGenders={activeGenders}
          counts={counts}
        />

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-charcoal/20 py-20 text-center">
              <p className="text-charcoal-soft max-w-sm mx-auto">
                No products match these filters yet. Try clearing filters or
                check back soon as we add more fragrances.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {products.map((p) => {
                const ratings: number[] = p.reviews.map((r) => r.rating);
                const avg = ratings.length
                  ? ratings.reduce((a: number, b: number) => a + b, 0) /
                    ratings.length
                  : 0;
                return (
                  <ProductCard
                    key={p.id}
                    slug={p.slug}
                    name={p.name}
                    brandName={p.brand?.name}
                    price={p.price.toNumber()}
                    image={p.images[0]}
                    rating={avg}
                    reviewCount={ratings.length}
                  />
                );
              })}
            </div>
          )}

          <Pagination
            basePath={basePath}
            currentPage={currentPage}
            totalPages={totalPages}
            searchParams={sp}
          />
        </div>
      </div>
    </div>
  );
}
