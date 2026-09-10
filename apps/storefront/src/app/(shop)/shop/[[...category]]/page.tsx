import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { prisma, withDbRetry } from "db";
import { ProductCard } from "@/components/ProductCard";
import { Filters, type FacetOption } from "@/components/shop/Filters";
import { Pagination } from "@/components/shop/Pagination";

const PAGE_SIZE = 12;
const GENDERS = ["Men", "Women", "Children", "Unisex"] as const;

const PRICE_BUCKETS = [
  { key: "under-30k", label: "Under NGN 30,000", min: 0, max: 30000 },
  { key: "30k-50k", label: "NGN 30,000 – 50,000", min: 30000, max: 50000 },
  { key: "above-50k", label: "Above NGN 50,000", min: 50000, max: undefined },
] as const;

const SORT_OPTIONS = {
  newest: { label: "Featured", orderBy: { createdAt: "desc" as const } },
  "price-asc": { label: "Price: Low to High", orderBy: { price: "asc" as const } },
  "price-desc": { label: "Price: High to Low", orderBy: { price: "desc" as const } },
} as const;

type SortKey = keyof typeof SORT_OPTIONS;

type PageProps = {
  params: Promise<{ category?: string[] }>;
  searchParams: Promise<{
    gender?: string | string[];
    scent?: string | string[];
    price?: string | string[];
    brand?: string | string[];
    sort?: string;
    page?: string;
    q?: string;
  }>;
};

function normalizeList<T extends string>(
  value: string | string[] | undefined,
  allowed?: readonly T[],
): T[] {
  if (!value) return [];
  const arr = Array.isArray(value) ? value : [value];
  if (!allowed) return arr as T[];
  return arr.filter((v): v is T => (allowed as readonly string[]).includes(v));
}

function priceBucketWhere(keys: string[]) {
  const buckets = PRICE_BUCKETS.filter((b) => keys.includes(b.key));
  if (buckets.length === 0) return undefined;
  return {
    OR: buckets.map((b) => ({
      price: {
        gte: b.min,
        ...(b.max !== undefined && { lt: b.max }),
      },
    })),
  };
}

async function getCategory(slug: string | undefined) {
  if (!slug) return null;
  const category = await withDbRetry(() =>
    prisma.category.findUnique({ where: { slug } }),
  );
  if (!category) notFound();
  return category;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: categorySegments } = await params;
  const slug = categorySegments?.[0];
  const category = slug
    ? await withDbRetry(() => prisma.category.findUnique({ where: { slug } }))
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

  const activeGenders = normalizeList(sp.gender, GENDERS);
  const activeScents = normalizeList(sp.scent);
  const activePriceBuckets = normalizeList(
    sp.price,
    PRICE_BUCKETS.map((b) => b.key),
  );
  const activeBrands = normalizeList(sp.brand);
  const searchQuery = typeof sp.q === "string" ? sp.q.trim() : "";
  const sortKey: SortKey =
    sp.sort && sp.sort in SORT_OPTIONS ? (sp.sort as SortKey) : "newest";
  const currentPage = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const categoryWhere = category ? { categoryId: category.id } : {};
  const priceWhere = priceBucketWhere(activePriceBuckets);
  const searchWhere = searchQuery
    ? {
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" as const } },
          {
            description: {
              contains: searchQuery,
              mode: "insensitive" as const,
            },
          },
          {
            brand: {
              name: { contains: searchQuery, mode: "insensitive" as const },
            },
          },
        ],
      }
    : undefined;

  // priceWhere and searchWhere both need their own top-level `OR` — an
  // object spread would let the second silently clobber the first, so
  // any conditions with their own OR go into an `AND` array instead.
  const where = {
    ...categoryWhere,
    ...(activeGenders.length > 0 && { gender: { in: activeGenders } }),
    ...(activeScents.length > 0 && { scentProfile: { in: activeScents } }),
    ...(activeBrands.length > 0 && { brand: { slug: { in: activeBrands } } }),
    ...((priceWhere || searchWhere) && {
      AND: [priceWhere, searchWhere].filter(Boolean),
    }),
  };

  const basePath = category ? `/shop/${category.slug}` : "/shop";

  const [
    products,
    totalCount,
    genderCounts,
    scentGroups,
    brandGroups,
    brandList,
    priceCounts,
  ] = await withDbRetry(() =>
    Promise.all([
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
          prisma.product.count({ where: { ...categoryWhere, gender } }),
        ),
      ),
      prisma.product.groupBy({
        by: ["scentProfile"],
        where: { ...categoryWhere, scentProfile: { not: null } },
        _count: { _all: true },
      }),
      prisma.product.groupBy({
        by: ["brandId"],
        where: { ...categoryWhere, brandId: { not: null } },
        _count: { _all: true },
      }),
      prisma.brand.findMany({ orderBy: { name: "asc" } }),
      Promise.all(
        PRICE_BUCKETS.map((b) =>
          prisma.product.count({
            where: {
              ...categoryWhere,
              price: { gte: b.min, ...(b.max !== undefined && { lt: b.max }) },
            },
          }),
        ),
      ),
    ]),
  );

  const counts = Object.fromEntries(
    GENDERS.map((gender, i) => [gender, genderCounts[i]]),
  );

  const scentOptions: FacetOption[] = scentGroups
    .filter((g) => g.scentProfile)
    .map((g) => ({
      value: g.scentProfile as string,
      label: g.scentProfile as string,
      count: g._count._all,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const brandOptions: FacetOption[] = brandGroups
    .map((g) => {
      const brand = brandList.find((b) => b.id === g.brandId);
      return brand
        ? { value: brand.slug, label: brand.name, count: g._count._all }
        : null;
    })
    .filter((opt): opt is FacetOption => opt !== null)
    .sort((a, b) => a.label.localeCompare(b.label));

  const priceOptions: FacetOption[] = PRICE_BUCKETS.map((b, i) => ({
    value: b.key,
    label: b.label,
    count: priceCounts[i],
  }));

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
            {searchQuery
              ? `Results for "${searchQuery}"`
              : category
                ? category.name
                : "All Fragrances"}
          </h1>
          <p className="text-sm text-charcoal-soft mt-1">
            Showing {products.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
            –{Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount}{" "}
            results
          </p>
        </div>

        <details className="relative text-sm">
          <summary className="flex items-center gap-2 cursor-pointer select-none list-none text-charcoal">
            <span className="text-charcoal-soft">Sort by:</span>
            <span className="font-medium">{SORT_OPTIONS[sortKey].label}</span>
            <ChevronDown size={14} />
          </summary>
          <div className="absolute right-0 z-10 mt-2 w-52 rounded-xl border border-charcoal/10 bg-white py-2 shadow-lg">
            {(Object.keys(SORT_OPTIONS) as SortKey[]).map((key) => {
              const query = new URLSearchParams();
              activeGenders.forEach((g) => query.append("gender", g));
              activeScents.forEach((s) => query.append("scent", s));
              activePriceBuckets.forEach((p) => query.append("price", p));
              activeBrands.forEach((b) => query.append("brand", b));
              if (key !== "newest") query.set("sort", key);
              if (searchQuery) query.set("q", searchQuery);
              const href = query.toString()
                ? `${basePath}?${query.toString()}`
                : basePath;
              return (
                <Link
                  key={key}
                  href={href}
                  className={`block px-4 py-2 transition-colors ${
                    sortKey === key
                      ? "text-aubergine font-medium"
                      : "text-charcoal hover:bg-lavender-light"
                  }`}
                >
                  {SORT_OPTIONS[key].label}
                </Link>
              );
            })}
          </div>
        </details>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <Filters
          basePath={basePath}
          activeGenders={activeGenders}
          genderCounts={counts}
          activeScents={activeScents}
          scentOptions={scentOptions}
          activePriceBuckets={activePriceBuckets}
          priceOptions={priceOptions}
          activeBrands={activeBrands}
          brandOptions={brandOptions}
          activeQuery={searchQuery || undefined}
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
