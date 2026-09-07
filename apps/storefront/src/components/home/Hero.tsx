"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-aubergine via-aubergine to-[#5c2350]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-cream"
        >
          <motion.h1
            variants={item}
            className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] font-semibold"
          >
            Our fragrance collection inspires &amp;{" "}
            <span className="italic text-magenta-light">boosts confidence.</span>
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 text-cream/80 max-w-md text-base sm:text-lg"
          >
            We sell perfumes that are gentle on both the environment and your
            senses — every bottle chosen for character, not just scent.
          </motion.p>
          <motion.div variants={item} className="mt-8">
            <Link
              href="/shop"
              className="inline-flex items-center rounded-full bg-magenta px-8 py-3.5 text-sm font-semibold text-white hover:bg-magenta-light transition-colors"
            >
              Order Now
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative aspect-square max-w-md mx-auto w-full"
          aria-hidden="true"
        >
          <div className="absolute inset-4 rounded-[2rem] bg-gradient-to-br from-lavender via-lavender-light to-cream/40 rotate-3" />
          <div className="absolute inset-4 rounded-[2rem] bg-gradient-to-tl from-magenta/30 via-transparent to-transparent -rotate-2" />
          <div className="absolute inset-10 flex items-end justify-center">
            <div className="w-24 h-40 sm:w-28 sm:h-48 rounded-t-full rounded-b-lg bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-sm shadow-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
