import type { MetadataRoute } from "next";
import { prisma, withDbRetry } from "db";
import { SITE_URL } from "@/lib/site";

// Static marketing + top-level shop pages. Cart, checkout, account, and
// auth pages are intentionally excluded — they're already marked
// robots: noindex on their own metadata, and a sitemap entry for a page
// that says "don't index me" is contradictory.
const STATIC_ROUTES = ["", "/shop", "/collection", "/about", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    withDbRetry(() =>
      prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
    ),
    withDbRetry(() =>
      prisma.category.findMany({ select: { slug: true } }),
    ),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/shop/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
