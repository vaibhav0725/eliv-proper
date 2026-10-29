"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const stories = [
  {
    name: "Reliability",
    line: "Ensuring on-time delivery with complete documentation.",
    image: "/industry/ocean.jpg",
    alt: "Container ship at a terminal",
  },
  {
    name: "Customer-centric",
    line: "Tailoring solutions to exceed customer expectations.",
    image: "/industry/awards.jpg",
    alt: "Team in a meeting",
  },
  {
    name: "Global Expertise",
    line: "Facilitating seamless cross-border logistics.",
    image: "/industry/canal.jpg",
    alt: "Shipping containers at a port",
  },
  {
    name: "Innovation",
    line: "Leveraging technology for optimized logistics.",
    image: "/industry/warehouse.jpg",
    alt: "Warehouse aisle",
  },
  {
    name: "Sustainability",
    line: "Committing to eco-friendly and ethical practices.",
    image: "/industry/accreditation.jpg",
    alt: "People reviewing documents",
  },
];

export function IndustryMoving() {
  const [active, setActive] = useState(0);
  const story = stories[active];

  return (
    <section className="grid grid-cols-1 items-start gap-x-12 gap-y-4 bg-black px-6 py-12 text-white sm:px-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:px-16 lg:pt-16 lg:pb-14">
      <h2 className="pb-24 text-[clamp(2.6rem,5.2vw,4.6rem)] leading-[0.9] font-bold tracking-[-0.035em] uppercase lg:whitespace-nowrap lg:pb-28">
        <span className="block text-[#7a7a7a]">Our</span>
        <span className="block">values</span>
      </h2>
      <div className="lg:pt-2">
        <p className="max-w-[13.5rem] text-[12px] leading-[1.45] text-neutral-400">
          On-time delivery, cross-border logistics, and solutions shaped around
          the customer.
        </p>
        <Link
          href="/about"
          className="mt-5 inline-flex rounded-full border border-white/50 px-4 py-1.5 text-[11px] tracking-[0.16em] uppercase transition-colors hover:bg-white hover:text-black"
        >
          View all
        </Link>
      </div>

      <ul className="min-w-0 lg:max-w-[760px]">
          {stories.map((item, index) => {
            const selected = index === active;
            return (
              <li key={item.name} className="border-t border-white/15 last:border-b">
                <button
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-x-6 py-3.5 text-left"
                >
                  <span>
                    <span className="block text-[13px] tracking-[0.14em] text-neutral-500 uppercase">
                      {item.name}
                    </span>
                    <span
                      className={`mt-1.5 block text-lg leading-snug ${
                        selected ? "text-white" : "text-white/85"
                      }`}
                    >
                      {item.line}
                    </span>
                  </span>
                  <span className="pt-6 text-[13px] tracking-[0.12em] text-neutral-500 uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
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
          <span className="sr-only">{story.name}</span>
        </div>
    </section>
  );
}
