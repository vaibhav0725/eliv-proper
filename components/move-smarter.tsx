"use client";

import { motion } from "motion/react";

const rings = [0, 1, 2, 3, 4];
const cycle = 7;

export function MoveSmarter() {
  return (
    <section className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-black px-6 py-16 text-white sm:min-h-[340px] sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        {rings.map((ring) => (
          <motion.span
            key={ring}
            className="absolute aspect-square w-[115vmax] rounded-full border-2 border-[#8d8d8d]"
            initial={{ scale: 0.12, opacity: 0 }}
            animate={{ scale: [0.12, 1], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: cycle,
              repeat: Infinity,
              ease: "linear",
              delay: (ring * cycle) / rings.length,
              times: [0, 0.08, 0.62, 1],
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="text-[2.75rem] leading-[0.9] font-bold tracking-[-0.035em] uppercase sm:text-6xl lg:text-[4.5rem]">
          Ready to
          <br />
          Move
          <br />
          Smarter?
        </h2>
        <p className="mx-auto mt-5 max-w-[17.5rem] text-[13px] leading-[1.45] text-neutral-400">
          We are here to help you grow without hassle.
          <br />
          No call centres. No runaround. Just
          <br />
          experienced people ready to help.
        </p>
      </div>
    </section>
  );
}
