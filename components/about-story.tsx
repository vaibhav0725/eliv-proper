"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const chapters = [
  {
    index: "01",
    title: "The mission",
    body: "Get every shipment to the door it was promised, with one team accountable from the booking to the proof.",
    image: "/about/desk.jpg",
    alt: "People seated in a bright, high-ceilinged room",
  },
  {
    index: "02",
    title: "The vision",
    body: "Freight across the region that is as clear to the customer as it is to the people moving it.",
    image: "/about/aircraft.jpg",
    alt: "A wide lake between mountain ridges",
  },
  {
    index: "03",
    title: "The strategy",
    body: "Stay on the lanes we run, keep the file on one desk, and back each move with the network, the systems, and the Trusted Trader standard.",
    image: "/about/warehouse.jpg",
    alt: "Aerial view of traffic moving through a city",
  },
];

function Frame({
  chapter,
}: {
  chapter: (typeof chapters)[number];
}) {
  return (
    <article className="relative h-[82svh] min-h-[540px] w-full shrink-0 lg:h-full lg:min-h-0 lg:w-auto lg:flex-1 lg:basis-0">
      <Image
        src={chapter.image}
        alt={chapter.alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/25" />
      <div className="absolute inset-x-0 bottom-0 max-w-xl p-6 text-white sm:p-10 lg:p-14">
        <p className="text-[11px] tracking-[0.2em] text-white/70 uppercase">
          {`${chapter.index} / 0${chapters.length}`}
        </p>
        <h2 className="mt-3 text-[clamp(3rem,6vw,5.5rem)] leading-[0.88] font-black tracking-[-0.045em] uppercase">
          {chapter.title}
        </h2>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/85">
          {chapter.body}
        </p>
      </div>
    </article>
  );
}

export function AboutStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [
    "0%",
    `${-((chapters.length - 1) / chapters.length) * 100}%`,
  ]);

  return (
    <section className="bg-[#f3f1ec]">
      <div className="flex flex-col lg:hidden">
        {chapters.map((chapter) => (
          <Frame key={chapter.index} chapter={chapter} />
        ))}
      </div>

      <div
        ref={ref}
        className="relative hidden lg:block"
        style={{ height: `${chapters.length * 100}vh` }}
      >
        <div className="sticky top-24 h-[calc(100svh-6rem)] overflow-hidden">
          <motion.div
            style={{ x, width: `${chapters.length * 100}%` }}
            className="flex h-full"
          >
            {chapters.map((chapter) => (
              <Frame key={chapter.index} chapter={chapter} />
            ))}
          </motion.div>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-white/25">
            <motion.div
              className="h-px origin-left bg-white"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
