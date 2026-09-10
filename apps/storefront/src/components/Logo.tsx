import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/brand/aj-luxe-logo.png";

/**
 * Real brand mark (source: the client-supplied AJ Luxe Perfume logo,
 * background removed) — replaces the earlier hand-drawn SVG
 * approximation of the bottle/lamp silhouette + wordmark.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center shrink-0 ${className}`}>
      <Image
        src={logo}
        alt="AJ Luxe Perfume"
        className="h-8 sm:h-9 w-auto"
        priority
      />
    </Link>
  );
}
