"use client";

import { motion, useReducedMotion } from "motion/react";

const steps = [
  {
    index: "01",
    title: "Quote the lane",
    body: "Origin, mode, and timing are set before a booking is raised. The route is chosen for the cargo.",
  },
  {
    index: "02",
    title: "Lock the space",
    body: "Rate, space, and documents are confirmed in one pass, so the file is complete before the freight leaves.",
  },
  {
    index: "03",
    title: "Move it",
    body: "Air, ocean, or road stays on one thread. Exceptions surface while there is still time to act.",
  },
  {
    index: "04",
    title: "Prove it",
    body: "Clearance, delivery, and proof of delivery close the move. The same people who booked it see it through.",
  },
];

export function HomeProcess() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-[#f3f1ec] text-neutral-950">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
        <p className="text-[11px] font-medium tracking-[0.22em] text-neutral-500 uppercase">
          A booking, in order
        </p>
        <h2 className="mt-4 max-w-3xl text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase">
          From the first rate
          <br />
          to the last signature.
        </h2>
        <ol className="mt-16 grid gap-px bg-neutral-950/10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.li
              key={step.index}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="bg-[#f3f1ec] px-1 pt-6 pb-2 lg:px-6"
            >
              <p className="text-[clamp(3rem,5vw,4.5rem)] leading-none font-black tracking-[-0.06em] text-neutral-950/15">
                {step.index}
              </p>
              <h3 className="mt-6 text-lg font-semibold tracking-tight uppercase">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{step.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
