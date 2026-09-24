"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const stories = [
  {
    date: "September 24, 2026",
    title:
      "China–Australia Ocean Freight: Rates Are Moving Higher — What Importers Need to Know",
    tag: "Asia Pacific",
    image: "/industry/ocean.jpg",
    alt: "Container ship at sea",
  },
  {
    date: "September 15, 2026",
    title:
      "United Carriers & Christopher Lebon Named 2026 Local Business Awards Finalists",
    tag: "Featured",
    image: "/industry/awards.jpg",
    alt: "Team in a meeting",
  },
  {
    date: "September 8, 2026",
    title: "China Set to Open Pinglu Canal – Its New Shortcut to South-East Asia",
    tag: "Asia Pacific",
    image: "/industry/canal.jpg",
    alt: "Shipping containers at a port",
  },
  {
    date: "September 6, 2026",
    title: "UC Courtside Is Here",
    tag: "Featured",
    image: "/industry/warehouse.jpg",
    alt: "Warehouse aisle",
  },
  {
    date: "September 3, 2026",
    title: "United Carriers Achieves Australian Trusted Trader Accreditation",
    tag: "Featured",
    image: "/industry/accreditation.jpg",
    alt: "People reviewing documents",
  },
  {
    date: "September 1, 2026",
    title: "UC Market Update China - September",
    tag: "Market Updates",
    image: "/industry/market.jpg",
    alt: "Cargo ship near port",
  },
];

export function IndustryMoving() {
  const [active, setActive] = useState(0);
  const story = stories[active];

  return (
    <section className="grid grid-cols-1 items-start gap-x-12 gap-y-10 bg-black px-6 py-12 text-white sm:px-10 lg:h-svh lg:min-h-[760px] lg:grid-cols-[minmax(0,1fr)_460px] lg:grid-rows-[auto_minmax(0,1fr)] lg:px-16 lg:pt-16 lg:pb-14">
      <h2 className="text-[clamp(2.6rem,5.2vw,4.6rem)] leading-[0.9] font-bold tracking-[-0.035em] uppercase lg:whitespace-nowrap">
        <span className="block text-[#7a7a7a]">What&apos;s moving</span>
        <span className="block">in your industry</span>
      </h2>
      <div className="lg:pt-2">
        <p className="max-w-[13.5rem] text-[12px] leading-[1.45] text-neutral-400">
          Stay ahead of the shifts shaping trade across APAC — from regulatory
          changes to new shipping routes and supply chain trends.
        </p>
        <Link
          href="/insights"
          className="mt-5 inline-flex rounded-full border border-white/50 px-4 py-1.5 text-[11px] tracking-[0.16em] uppercase transition-colors hover:bg-white hover:text-black"
        >
          View all
        </Link>
      </div>

      <ul className="min-w-0 self-end lg:max-w-[680px]">
          {stories.map((item, index) => {
            const selected = index === active;
            return (
              <li key={item.title} className="border-t border-white/15 last:border-b">
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 py-3 text-left"
                >
                  <span>
                    <span className="block text-[10px] tracking-[0.14em] text-neutral-500 uppercase">
                      {item.date}
                    </span>
                    <span
                      className={`mt-1 block truncate text-[14px] ${
                        selected ? "text-white" : "text-white/85"
                      }`}
                    >
                      {item.title}
                    </span>
                  </span>
                  <span className="pt-5 text-[10px] tracking-[0.12em] text-neutral-500 uppercase">
                    {item.tag}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="relative aspect-[4/3] w-full self-end overflow-hidden bg-neutral-900">
          {stories.map((item, index) => (
            <Image
              key={item.image}
              src={item.image}
              alt={index === active ? item.alt : ""}
              fill
              sizes="460px"
              className={`object-cover transition-opacity duration-500 ${
                index === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <span className="sr-only">{story.title}</span>
        </div>
    </section>
  );
}
