"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { HeroSlideshow } from "./HeroSlideshow";

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
    <section className="relative overflow-hidden bg-linear-to-b from-[#7a3568] via-aubergine-light to-aubergine">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="text-cream"
        >
          <motion.h1
            variants={item}
            className="font-sans font-extrabold leading-[1.1]"
          >
            <span className="block text-2xl sm:text-3xl lg:text-4xl">
              Our fragrance collection inspires &amp;
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl mt-1">
              Boosts confidence.
            </span>
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
        >
          <HeroSlideshow />
        </motion.div>
      </div>
    </section>
  );
}
