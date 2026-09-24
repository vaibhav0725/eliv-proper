"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";

const lanes = [
  {
    index: "01",
    title: "Road",
    line: "Linehaul and last mile, timed to the warehouse door.",
    image: "/services/road.jpg",
    alt: "A freight truck on the road",
  },
  {
    index: "02",
    title: "Air",
    line: "Priority freight when the schedule cannot slip.",
    image: "/services/air.jpg",
    alt: "An aircraft on the tarmac",
  },
  {
    index: "03",
    title: "Ocean",
    line: "Container and project cargo across the main trade lanes.",
    image: "/services/ocean.jpg",
    alt: "Shipping containers at a terminal",
  },
  {
    index: "04",
    title: "Control",
    line: "One team watching the move, from booking to proof of delivery.",
    image: "/services/control.jpg",
    alt: "A team planning a shipment",
  },
];

export function ServicesLogistics() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-[#f4f4f2] px-6 py-20 text-neutral-950 sm:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
        <p className="text-[11px] font-medium tracking-[0.2em] text-neutral-500 uppercase">
          Our services
        </p>
        <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] font-bold tracking-[-0.04em] uppercase">
          <span className="text-[#a3a3a3]">Integrated</span>
          <br />
          logistics for <span className="text-neutral-950">complex</span>
          <br />
          supply chains
        </h2>
      </div>

      <div className="mx-auto mt-8 max-w-6xl lg:mt-6">
        <p className="max-w-sm text-[14px] leading-relaxed text-neutral-600">
          We deliver scalable freight and logistics solutions tailored to
          modern business demands — helping companies reduce delays, improve
          supply chain visibility, and move goods efficiently with confidence
          across domestic and global markets.
        </p>
      </div>

      <div
        className="mx-auto mt-12 flex max-w-6xl flex-col gap-3 sm:flex-row sm:h-[460px]"
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
              animate={{ flex: selected ? 2.35 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 32 }}
              className="relative h-64 min-w-0 overflow-hidden text-left sm:h-full"
            >
              <Image
                src={lane.image}
                alt={lane.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className={`object-cover transition duration-500 ${
                  selected ? "scale-105" : "scale-100 brightness-75"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                <p className="text-[11px] tracking-[0.18em] text-white/70">
                  {lane.index}
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {lane.title}
                </p>
                <p
                  className={`overflow-hidden text-[13px] leading-snug text-white/85 transition-all duration-300 ${
                    selected ? "mt-2 max-h-16 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {lane.line}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
