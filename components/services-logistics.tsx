"use client";

import Image from "next/image";
import { useState } from "react";

const description =
  "Describe the service and how customers or clients can benefit from it. This is the place to add a short description with relevant details, like pricing, duration and how to book.";

const lanes = [
  {
    title: "Ocean Freight",
    line: description,
    image: "/services/ocean.jpg",
    alt: "Shipping containers at a terminal",
  },
  {
    title: "Air Freight",
    line: description,
    image: "/services/air.jpg",
    alt: "An aircraft wing above the clouds",
  },
  {
    title: "First and Last Mile Delivery",
    line: description,
    image: "/services/road.jpg",
    alt: "A freight truck on the road",
  },
  {
    title: "Customs Clearance",
    line: description,
    image: "/services/control.jpg",
    alt: "A team planning a shipment",
  },
  {
    title: "Warehousing and Distribution",
    line: description,
    image: "/about/warehouse.jpg",
    alt: "A warehouse floor",
  },
  {
    title: "Refrigerated Transport",
    line: description,
    image: "/industries/food.png",
    alt: "Temperature-controlled freight",
  },
  {
    title: "E-commerce Fulfillment",
    line: description,
    image: "/industries/retail.png",
    alt: "Retail goods ready for fulfillment",
  },
  {
    title: "Dangerous Goods",
    line: description,
    image: "/industries/energy.png",
    alt: "Specialist cargo handling",
  },
];

export function ServicesLogistics() {
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

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-3">
        <ServiceRow items={lanes.slice(0, 4)} start={0} />
        <ServiceRow items={lanes.slice(4)} start={4} initial={3} />
      </div>
    </section>
  );
}

function ServiceRow({
  items,
  start,
  initial = 0,
}: {
  items: typeof lanes;
  start: number;
  initial?: number;
}) {
  const [active, setActive] = useState(initial);

  return (
    <div className="flex flex-col gap-3 lg:h-[440px] lg:flex-row">
      {items.map((lane, index) => {
        const selected = index === active;
        return (
          <button
            key={lane.title}
            type="button"
            onClick={() => setActive(index)}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            className={`relative min-w-0 overflow-hidden text-left transition-[flex-grow,height] duration-500 ease-out ${
              selected ? "h-[22rem] lg:flex-[2.4]" : "h-36 lg:flex-1"
            } lg:h-auto`}
          >
            <Image
              src={lane.image}
              alt={lane.alt}
              fill
              sizes="(min-width: 1024px) 28vw, 100vw"
              className={`object-cover transition duration-500 ${
                selected ? "scale-105" : "scale-100 brightness-75"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/20" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
              <p className="text-[11px] tracking-[0.18em] text-white/70">
                {String(start + index + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 text-lg leading-tight font-semibold tracking-tight sm:text-xl">
                {lane.title}
              </p>
              <p
                className={`overflow-hidden text-[13px] leading-snug text-white/85 transition-all duration-300 ${
                  selected ? "mt-2 max-h-32 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {lane.line}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
