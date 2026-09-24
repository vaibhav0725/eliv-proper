"use client";

import { useState } from "react";

const reasons = [
  {
    title: "Real career growth",
    body: "You won’t be stuck in a lane. We actively invest in developing our people to expand their comfort zones.",
  },
  {
    title: "High-impact work",
    body: "Work on real global supply chains where your decisions directly influence outcomes.",
  },
  {
    title: "Genuine expertise",
    body: "Gain exposure across international freight and multiple industries, not just process familiarity.",
  },
  {
    title: "Direct leadership access",
    body: "Work closely with decision-makers and learn from experienced operators, not hierarchy.",
  },
  {
    title: "Ownership and responsibility",
    body: "You are trusted to manage priorities and deliver outcomes. Initiative is expected.",
  },
  {
    title: "Team-oriented culture",
    body: "When challenges arise, you are supported, and expected to step up.",
  },
  {
    title: "Client-facing experience",
    body: "Engage directly with clients, spend time on the ground, and understand their commercial drivers.",
  },
  {
    title: "Reputation and stability",
    body: "Represent a business known for reliability, with a clear growth trajectory across APAC.",
  },
  {
    title: "Performance-driven environment",
    body: "Clear expectations, measured outcomes, and recognised performance. Results matter.",
  },
];

export function CareersWhy() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-neutral-950 text-white">
      <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:grid lg:grid-cols-[minmax(260px,0.72fr)_minmax(0,1.15fr)] lg:items-start lg:px-14">
        <div className="py-16 lg:sticky lg:top-16 lg:self-start lg:py-14">
          <p className="text-[10px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
            Why join us
          </p>
          <h2 className="mt-4 max-w-xl text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase lg:mt-0">
            What to expect as part of the team
          </h2>
        </div>

        <div className="relative pb-16 lg:py-14">
          <p
            aria-hidden
            className="pointer-events-none sticky top-16 z-0 h-0 overflow-visible text-right text-[28vw] leading-none font-black tracking-[-0.06em] text-white/6 select-none lg:text-[16vw]"
          >
            <span className="block -translate-y-2 lg:translate-y-6">
              {String(active + 1).padStart(2, "0")}
            </span>
          </p>

          <ul className="relative z-10 mt-10 border-b border-white/15 lg:mt-0">
          {reasons.map((reason, index) => {
            const open = index === active;
            return (
              <li key={reason.title} className="border-t border-white/15">
                <button
                  type="button"
                  className="flex w-full items-start gap-4 py-5 text-left sm:gap-8 sm:py-6"
                  aria-expanded={open}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                >
                  <span className="pt-2 text-xs tracking-[0.14em] text-zinc-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[clamp(1.7rem,4.2vw,3.6rem)] leading-[0.95] font-bold tracking-[-0.04em] uppercase transition-colors duration-300 ${
                        open ? "text-white" : "text-white/28"
                      }`}
                    >
                      {reason.title}
                    </span>
                    <span
                      className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="block max-w-xl pt-4 pb-2 text-sm leading-6 text-zinc-400">
                          {reason.body}
                        </span>
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        </div>
      </div>
    </section>
  );
}
