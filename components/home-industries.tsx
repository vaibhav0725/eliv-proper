"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const industries = [
  {
    title: "Mining",
    image: "/industries/mining.png",
    alt: "Mining and resources freight",
  },
  {
    title: "Construction",
    image: "/industries/construction.png",
    alt: "Construction site materials",
  },
  {
    title: "Energy",
    image: "/industries/energy.png",
    alt: "Energy and renewables cargo",
  },
  {
    title: "Fashion",
    image: "/industries/fashion.png",
    alt: "Fashion retail floor",
  },
  {
    title: "Technology",
    image: "/industries/technology.png",
    alt: "Technology hardware",
  },
  {
    title: "Automotive",
    image: "/industries/automotive.png",
    alt: "Automotive and industrial freight",
  },
];

export function HomeIndustries() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = industries[active];

  return (
    <section className="bg-neutral-950 text-white">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-20 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.85fr)] lg:items-center lg:px-14 lg:py-24">
        <div>
          <p className="text-[11px] font-medium tracking-[0.22em] text-white/45 uppercase">
            Industries
          </p>
          <ul className="mt-6">
            {industries.map((item, index) => {
              const selected = index === active;
              return (
                <li key={item.title} className="border-t border-white/15 last:border-b">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    className="flex w-full items-baseline gap-6 py-4 text-left"
                    aria-pressed={selected}
                  >
                    <span className="text-[11px] tracking-[0.16em] text-white/35">
                      {`0${index + 1}`}
                    </span>
                    <span
                      className={`text-[clamp(1.8rem,3.4vw,3rem)] leading-none font-bold tracking-[-0.04em] uppercase transition-colors ${
                        selected ? "text-white" : "text-white/30"
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <Link
            href="/industries"
            className="mt-8 inline-flex h-11 items-center rounded-full bg-white px-5 text-[11px] font-semibold tracking-[0.14em] text-neutral-950 uppercase"
          >
            All industries
          </Link>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.image}
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={current.image}
                alt={current.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <p className="absolute bottom-5 left-5 text-[11px] tracking-[0.18em] uppercase">
            {current.title}
          </p>
        </div>
      </div>
    </section>
  );
}
