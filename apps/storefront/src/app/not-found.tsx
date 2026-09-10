import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-20 text-center">
      <Logo className="mb-10" />

      <p className="font-display text-7xl sm:text-8xl text-aubergine/20 leading-none mb-4">
        404
      </p>
      <h1 className="font-display text-2xl sm:text-3xl text-aubergine mb-3">
        This page has wandered off
      </h1>
      <p className="text-charcoal-soft max-w-sm mb-10">
        The page you&apos;re looking for doesn&apos;t exist, or may have
        moved. Let&apos;s get you back on track.
      </p>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="rounded-lg bg-aubergine text-cream text-sm font-medium px-6 py-3 hover:bg-aubergine-light transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/shop"
          className="rounded-lg border border-aubergine px-6 py-3 text-sm font-medium text-aubergine hover:bg-lavender-light/50 transition-colors"
        >
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
