"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const lines = ["Keep the", "file", "open."];

export function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-[calc(100svh-4rem)] overflow-hidden text-white"
    >
      <motion.div
        aria-hidden
        className="absolute inset-x-0 -top-[8%] h-[120%]"
        style={reduce ? undefined : { y: imageY }}
      >
        <Image
          src="/about/port.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-[1440px] items-center px-6 py-16 sm:px-10 lg:px-14">
        <div className="max-w-4xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-[11px] font-medium tracking-[0.22em] text-white/70 uppercase"
          >
            About United Carriers
          </motion.p>

          <h1 className="mt-5 text-[clamp(4.4rem,10vw,8.8rem)] leading-[0.82] font-black tracking-[-0.055em] uppercase">
            {lines.map((line, index) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "115%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.95,
                    delay: 0.08 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-md text-[15px] leading-relaxed text-white/85"
          >
            Freight across Australia, New Zealand, Hong Kong, and China. The
            same people who open the booking stay on it until delivery is
            proved.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
