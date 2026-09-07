import Link from "next/link";

type PaginationProps = {
  basePath: string;
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
};

function buildHref(
  basePath: string,
  page: number,
  searchParams: Record<string, string | string[] | undefined>,
) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "page") continue;
    if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, v));
    } else if (value) {
      query.set(key, value);
    }
  }
  if (page > 1) query.set("page", String(page));
  const qs = query.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({
  basePath,
  currentPage,
  totalPages,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-2"
    >
      <Link
        href={buildHref(basePath, Math.max(1, currentPage - 1), searchParams)}
        aria-disabled={currentPage === 1}
        className={`px-4 py-2 rounded-full text-sm border ${
          currentPage === 1
            ? "border-charcoal/10 text-charcoal/30 pointer-events-none"
            : "border-charcoal/20 text-charcoal hover:border-aubergine hover:text-aubergine transition-colors"
        }`}
      >
        Previous
      </Link>

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(basePath, p, searchParams)}
          aria-current={p === currentPage ? "page" : undefined}
          className={`w-9 h-9 flex items-center justify-center rounded-full text-sm ${
            p === currentPage
              ? "bg-aubergine text-cream"
              : "text-charcoal hover:bg-lavender-light transition-colors"
          }`}
        >
          {p}
        </Link>
      ))}

      <Link
        href={buildHref(
          basePath,
          Math.min(totalPages, currentPage + 1),
          searchParams,
        )}
        aria-disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-full text-sm border ${
          currentPage === totalPages
            ? "border-charcoal/10 text-charcoal/30 pointer-events-none"
            : "border-charcoal/20 text-charcoal hover:border-aubergine hover:text-aubergine transition-colors"
        }`}
      >
        Next
      </Link>
    </nav>
  );
}
