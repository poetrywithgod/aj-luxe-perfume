"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * No real product photography exists yet. Each slide below is placeholder
 * bottle art (gradient body + silhouette cap), one mood per fragrance
 * family, so the section is fully functional today. Swap `art` for a real
 * product photo per slide once images are uploaded through the admin
 * panel — the slide list, timing, and dot indicators can stay as-is.
 */
const slides = [
  { label: "Floral", from: "#f3d9ec", to: "#c13fa0" },
  { label: "Woody & Amber", from: "#e8c9a0", to: "#8a5a2a" },
  { label: "Citrus", from: "#fbe9a8", to: "#e8b84b" },
  { label: "Oud", from: "#c9aedb", to: "#3a1530" },
  { label: "Musk", from: "#e6d9ef", to: "#7a5f8a" },
];

const AUTO_ADVANCE_MS = 3500;

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, []);

  const active = slides[index];

  return (
    <div className="relative aspect-square max-w-md mx-auto w-full">
      <div className="absolute inset-0 rounded-[2rem] overflow-hidden bg-white/5 ring-1 ring-cream/15">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex items-end justify-center pb-10"
            style={{
              background: `radial-gradient(circle at 50% 20%, ${active.from}33, transparent 60%)`,
            }}
          >
            {/* placeholder bottle silhouette — see note above */}
            <div
              className="w-28 h-44 sm:w-32 sm:h-52 rounded-t-[3rem] rounded-b-lg shadow-2xl"
              style={{
                background: `linear-gradient(180deg, ${active.from}, ${active.to})`,
              }}
            >
              <div
                className="w-8 h-6 mx-auto -translate-y-2 rounded-sm"
                style={{ background: active.to }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.label}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${slide.label} slide`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-6 bg-cream" : "w-1.5 bg-cream/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
