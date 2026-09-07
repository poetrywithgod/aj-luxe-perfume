import Link from "next/link";

/**
 * Bottle/lamp-silhouette mark + stacked wordmark, per the Figma logo lockup:
 * "AJ Luxe" (bold, magenta) above "Perfume" (bold, charcoal), sans-serif,
 * tight leading, small glyph to the left.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 shrink-0 ${className}`}>
      <svg
        width="28"
        height="34"
        viewBox="0 0 28 34"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* stopper */}
        <path d="M11 1h6v3.5h-6z" fill="currentColor" />
        <rect x="12.5" y="0" width="3" height="1.6" fill="currentColor" />
        {/* neck */}
        <path d="M12 4.5h4v3.5h-4z" fill="currentColor" />
        {/* bulbous lamp-like body, wide at the base */}
        <path
          d="M14 8c-2.4 2-6 5.6-6 11.2C8 25.6 10.7 30 14 30s6-4.4 6-10.8C20 13.6 16.4 10 14 8Z"
          fill="currentColor"
        />
        {/* base */}
        <rect x="7" y="31" width="14" height="2.2" rx="1.1" fill="currentColor" />
      </svg>
      <span className="flex flex-col leading-[1.05]">
        <span className="font-sans font-extrabold text-magenta text-lg sm:text-xl">
          AJ Luxe
        </span>
        <span className="font-sans font-extrabold text-charcoal text-lg sm:text-xl">
          Perfume
        </span>
      </span>
    </Link>
  );
}
