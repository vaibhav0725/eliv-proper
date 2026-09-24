"use client";

import { useRef } from "react";

const jobs = [
  {
    title: "Warehouse Coordinator",
    description:
      "Coordinate inbound and outbound freight so warehouse movements stay accurate and on schedule.",
    location: "Melbourne",
    type: "Full-time",
  },
  {
    title: "Sales Executive",
    description:
      "Build client relationships across APAC and turn freight enquiries into ongoing business.",
    location: "Melbourne",
    type: "Full-time",
  },
  {
    title: "Customer Service & Operations Executive",
    description:
      "Run day-to-day shipments with clients, from booking through to delivery and follow-up.",
    location: "Auckland",
    type: "Full-time",
  },
  {
    title: "Sales Support",
    description:
      "Support the commercial team with quotes, client follow-up, and shipment coordination.",
    location: "Shenzhen",
    type: "Full-time",
  },
  {
    title: "HR Truck Driver",
    description:
      "Move freight on scheduled runs with a focus on safety, timing, and reliable handovers.",
    location: "Melbourne",
    type: "Full-time",
  },
  {
    title: "Customer Service Executive",
    description:
      "Be the client’s point of contact and keep each shipment moving with clear updates.",
    location: "Auckland",
    type: "Full-time",
  },
];

export function CareersJobs() {
  const label = useRef<HTMLDivElement>(null);

  function move(event: React.MouseEvent<HTMLUListElement>) {
    const chip = label.current;
    if (!chip) return;
    chip.style.transform = `translate3d(${event.clientX}px, ${event.clientY + 18}px, 0) translateX(-50%)`;
  }

  return (
    <section className="bg-[#f3f3f1] text-neutral-950">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
              Open roles
            </p>
            <h2 className="mt-4 max-w-3xl text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase">
              Find your place in the team
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-zinc-600 sm:text-[15px]">
              Mail your CV to us at{" "}
              <a
                href="mailto:contact@unitedcarriers.com"
                className="underline decoration-zinc-400 underline-offset-4 hover:text-neutral-950"
              >
                contact@unitedcarriers.com
              </a>
              .
            </p>
          </div>
          <p className="pb-1 text-sm tracking-[0.14em] text-zinc-500 uppercase">
            {String(jobs.length).padStart(2, "0")}
          </p>
        </div>

        <div className="group/jobs mt-14">
        <div className="hidden border-b border-neutral-950/15 pb-3 text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase lg:grid lg:grid-cols-[4.5rem_minmax(0,1fr)_9rem_7.5rem_2rem] lg:gap-x-6 lg:px-4">
          <span />
          <span>Jobs</span>
          <span className="text-right">Location</span>
          <span className="text-right">Type</span>
        </div>
        <ul className="border-b border-neutral-950/15" onMouseMove={move}>
          {jobs.map((job, index) => (
            <li key={job.title} className="border-t border-neutral-950/15">
              <a
                href={`mailto:contact@unitedcarriers.com?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                className="group grid cursor-none items-start gap-x-6 gap-y-3 py-6 transition-colors duration-300 hover:bg-neutral-950 hover:text-white sm:px-4 lg:grid-cols-[4.5rem_minmax(0,1fr)_9rem_7.5rem_2rem] lg:py-8"
              >
                <span className="hidden pt-2 text-xs tracking-[0.14em] text-zinc-500 transition-colors group-hover:text-white/50 lg:block">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block text-[clamp(1.35rem,2.4vw,2rem)] leading-none font-bold tracking-[-0.04em] uppercase">
                    {job.title}
                  </span>
                  <span className="mt-3 block max-w-xl text-sm leading-6 font-normal tracking-normal text-zinc-600 normal-case transition-colors group-hover:text-white/70">
                    {job.description}
                  </span>
                </span>
                <span className="flex gap-4 pt-1 text-sm text-zinc-600 transition-colors group-hover:text-white/70 lg:contents">
                  <span className="lg:pt-2 lg:text-right">{job.location}</span>
                  <span className="tracking-[0.08em] uppercase lg:pt-2 lg:text-right">
                    {job.type}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="hidden text-sm transition-transform duration-300 group-hover:translate-x-1 lg:block"
                >
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div
          ref={label}
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-50 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium tracking-[0.14em] text-neutral-950 uppercase opacity-0 shadow-sm transition-opacity duration-150 group-hover/jobs:opacity-100"
        >
          Apply now
        </div>
        </div>
      </div>
    </section>
  );
}
