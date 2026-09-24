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
      className="relative overflow-hidden bg-[#f3f1ec] text-neutral-950"
    >
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-[1440px] items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.78fr)] lg:gap-14 lg:px-14">
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-[11px] font-medium tracking-[0.22em] text-neutral-500 uppercase"
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
            className="mt-8 max-w-md text-[15px] leading-relaxed text-neutral-700"
          >
            Freight across Australia, New Zealand, Hong Kong, and China. The
            same people who open the booking stay on it until delivery is
            proved.
          </motion.p>
        </div>

        <motion.div
          className="relative aspect-[4/5] w-full overflow-hidden"
          style={reduce ? undefined : { y: imageY }}
        >
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { clipPath: "inset(18% 12% 18% 12%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/about/port.jpg"
              alt="A snow-covered mountain peak in evening light"
              fill
              priority
              sizes="(min-width: 1024px) 36vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
