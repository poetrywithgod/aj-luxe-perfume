// Canonical production URL, used anywhere an absolute URL is required:
// sitemap.xml, robots.txt, metadataBase (for resolving relative OG/canonical
// URLs), and structured data (JSON-LD). Falls back to the real production
// domain rather than localhost, since getting this wrong silently breaks
// SEO output (wrong canonical URLs, broken sitemap entries) rather than
// throwing an obvious error — set NEXT_PUBLIC_SITE_URL explicitly in
// Vercel once a final domain is confirmed.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://ajluxeperfume.com";
