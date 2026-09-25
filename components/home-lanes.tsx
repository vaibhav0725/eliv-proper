"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";

const lanes = [
  {
    title: "Australia",
    line: "Home base. Pickup, clearance, and delivery on the same file.",
    image: "/about/warehouse.jpg",
    alt: "Aerial view of traffic moving through a city",
  },
  {
    title: "New Zealand",
    line: "Ocean and air into the islands, timed to the warehouse door.",
    image: "/about/aircraft.jpg",
    alt: "A wide lake between mountain ridges",
  },
  {
    title: "Hong Kong",
    line: "The hub for cargo that has to turn around without sitting.",
    image: "/about/port.jpg",
    alt: "A snow-covered mountain peak in evening light",
  },
  {
    title: "China",
    line: "Origin freight, project cargo, and the documents that go with it.",
    image: "/about/truck.jpg",
    alt: "A foggy railway platform lit at night",
  },
];

export function HomeLanes() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-neutral-950 px-6 py-20 text-white sm:px-10 lg:px-14 lg:py-24">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium tracking-[0.22em] text-white/45 uppercase">
            Where we run
          </p>
          <h2 className="mt-4 text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase">
            Four markets.
            <br />
            One file.
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-6 text-white/60">
          Australia, New Zealand, Hong Kong, and China. The lanes are ones we
          actually operate, not a map of places we mention.
        </p>
      </div>

      <div
        className="mx-auto mt-12 flex max-w-[1440px] flex-col gap-3 sm:h-[460px] sm:flex-row"
        onMouseLeave={() => setActive(0)}
      >
        {lanes.map((lane, index) => {
          const selected = index === active;
          return (
            <motion.button
              key={lane.title}
              type="button"
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              animate={{ flex: selected ? 2.4 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 32 }}
              className="relative h-56 min-w-0 overflow-hidden text-left sm:h-full"
            >
              <Image
                src={lane.image}
                alt={lane.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className={`object-cover transition-transform duration-700 ${
                  selected ? "scale-100" : "scale-105"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[11px] tracking-[0.16em] text-white/60">
                  {`0${index + 1}`}
                </p>
                <p className="mt-2 text-[clamp(1.6rem,2.4vw,2.4rem)] leading-none font-bold tracking-[-0.04em] uppercase">
                  {lane.title}
                </p>
                <p
                  className={`mt-3 max-w-xs text-sm leading-6 text-white/80 ${
                    selected ? "block" : "hidden sm:block sm:opacity-0"
                  }`}
                >
                  {selected ? lane.line : ""}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
