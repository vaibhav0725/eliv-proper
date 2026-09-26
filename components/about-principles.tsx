"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const principles = [
  {
    index: "01",
    title: "Presence",
    body: "Someone who knows the file is reachable while the freight is moving. The call does not land in a queue.",
    image: "/about/team.jpg",
    alt: "A laptop and notebook on a wooden desk",
  },
  {
    index: "02",
    title: "Precision",
    body: "Documents, timing, and handling match what the cargo actually needs, including the pieces that do not fit a standard box.",
    image: "/about/warehouse.jpg",
    alt: "Aerial view of traffic moving through a city",
  },
  {
    index: "03",
    title: "Proof",
    body: "A move is finished when the proof is in, not when the truck leaves the dock. Delivery is a record, not a promise.",
    image: "/about/truck.jpg",
    alt: "A foggy railway platform lit at night",
  },
  {
    index: "04",
    title: "Continuity",
    body: "The people who quote the lane are still on it when the freight lands. One desk, from the first rate to the last signature.",
    image: "/about/desk.jpg",
    alt: "People seated in a bright, high-ceilinged room",
  },
];

export function AboutPrinciples() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = principles[active];

  return (
    <section className="bg-[#f3f1ec] text-neutral-950">
      <div className="grid lg:min-h-svh lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-14 lg:py-16">
          <p className="text-[11px] font-medium tracking-[0.22em] text-neutral-500 uppercase">
            What we hold to
          </p>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-neutral-600">
            Four standards on every file, whether the cargo is a standard box
            or a project that will not fit one.
          </p>
          <ul className="mt-10">
            {principles.map((item, index) => {
              const selected = index === active;
              return (
                <li key={item.index} className="border-t border-neutral-950/15 last:border-b">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    className="relative flex w-full items-baseline gap-5 py-6 text-left"
                    aria-pressed={selected}
                  >
                    {selected ? (
                      <motion.span
                        layoutId="principle-mark"
                        className="absolute top-0 bottom-0 left-0 w-0.5 bg-neutral-950"
                      />
                    ) : null}
                    <span className="pl-4 text-[11px] tracking-[0.16em] text-neutral-400">
                      {item.index}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-[clamp(2.4rem,4.6vw,4.25rem)] leading-[0.9] font-black tracking-[-0.045em] uppercase transition-colors ${
                          selected ? "text-neutral-950" : "text-neutral-300"
                        }`}
                      >
                        {item.title}
                      </span>
                      {selected ? (
                        <motion.span
                          initial={reduce ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="mt-4 block max-w-lg text-[15px] leading-relaxed text-neutral-600"
                        >
                          {item.body}
                        </motion.span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative min-h-[70svh] overflow-hidden bg-neutral-200 lg:min-h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.image}
              className="absolute inset-0"
              initial={reduce ? false : { clipPath: "inset(8% 8% 8% 8%)", scale: 1.08 }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={current.image}
                alt={current.alt}
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-white sm:p-10">
            <p className="text-[clamp(4rem,8vw,7rem)] leading-none font-black tracking-[-0.06em]">
              {current.index}
            </p>
            <p className="pb-2 text-[11px] tracking-[0.2em] uppercase">
              {current.title}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
