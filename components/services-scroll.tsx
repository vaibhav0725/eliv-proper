"use client";

import Image from "next/image";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";

const chapters = [
  {
    index: "01",
    title: "Plan the lane",
    body: "Origin, mode, and timing are set before a booking is raised. The route is chosen for the cargo, not the other way around.",
    image: "/services/control.jpg",
    alt: "A team planning a shipment",
  },
  {
    index: "02",
    title: "Lock the booking",
    body: "Space, rate, and documents are confirmed in one pass, so the file is complete before the freight leaves the dock.",
    image: "/services/machship.jpg",
    alt: "A booking dashboard on a screen",
  },
  {
    index: "03",
    title: "Move the freight",
    body: "Air, ocean, or road stays on one thread. Exceptions surface while there is still time to act.",
    image: "/services/ocean.jpg",
    alt: "Containers moving through a terminal",
  },
  {
    index: "04",
    title: "Land it cleanly",
    body: "Clearance, delivery, and proof of delivery close the move. The same people who booked it see it through.",
    image: "/services/road.jpg",
    alt: "A freight truck on delivery",
  },
];

export function ServicesScroll() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(
      chapters.length - 1,
      Math.floor(value * chapters.length),
    );
    setActive(next);
  });

  const chapter = chapters[active];

  return (
    <section
      ref={ref}
      className="relative bg-neutral-950 text-white"
      style={{ height: `${chapters.length * 100}vh` }}
    >
      <div className="sticky top-24 flex h-[calc(100svh-6rem)] flex-col overflow-hidden px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
        <div className="flex items-center justify-between gap-6">
          <p className="text-[11px] tracking-[0.2em] text-white/50 uppercase">
            How a move runs
          </p>
          <p className="text-[11px] tracking-[0.2em] text-white/50">
            {chapter.index} / 0{chapters.length}
          </p>
        </div>

        <div className="mt-6 grid min-h-0 flex-1 items-center gap-8 lg:grid-cols-[180px_minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
          <ol className="hidden flex-col gap-5 lg:flex">
            {chapters.map((item, index) => (
              <li key={item.index}>
                <p
                  className={`text-[13px] tracking-tight transition-colors ${
                    index === active ? "text-white" : "text-white/35"
                  }`}
                >
                  <span className="mr-3 text-[11px] tracking-[0.16em]">
                    {item.index}
                  </span>
                  {item.title}
                </p>
              </li>
            ))}
          </ol>

          <div className="relative h-56 overflow-hidden sm:h-72 lg:h-full lg:max-h-[68vh]">
            {chapters.map((item, index) => (
              <Image
                key={item.image}
                src={item.image}
                alt={index === active ? item.alt : ""}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={`object-cover transition-all duration-700 ${
                  index === active
                    ? "scale-100 opacity-100"
                    : "scale-105 opacity-0"
                }`}
              />
            ))}
          </div>

          <motion.article
            key={chapter.index}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md"
          >
            <p className="text-[11px] tracking-[0.2em] text-white/45 uppercase">
              {chapter.index}
            </p>
            <h2 className="mt-3 text-[clamp(2rem,3.4vw,3.25rem)] leading-[0.95] font-bold tracking-[-0.04em]">
              {chapter.title}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">
              {chapter.body}
            </p>
          </motion.article>
        </div>

        <div className="mt-6 h-px w-full bg-white/15">
          <motion.div
            className="h-px w-full origin-left bg-white"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      </div>
    </section>
  );
}
