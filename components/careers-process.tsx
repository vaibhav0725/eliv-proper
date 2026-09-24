"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    title: "Screening Application",
    body: "Submit your CV and a cover note. Our team reviews every application personally — no automated rejections. If it’s a fit, you’ll hear from us within 3–5 business days.",
    image: "/careers/screening.png",
    alt: "A team member reviewing work at a desk",
  },
  {
    title: "First Interview",
    body: "A 30–45 minute open dialogue with management. We’ll talk through your experience, what you’re looking for, and how you could contribute.",
    image: "/careers/interview.webp",
    alt: "Pallets of freight inside a warehouse",
  },
  {
    title: "Second Interview",
    body: "A deeper dive into how you work. This may include role-specific exercises designed to reflect real situations you’d encounter in the role.",
    image: "/careers/exercise.webp",
    alt: "A United Carriers truck at night",
  },
  {
    title: "Meet the Founder",
    body: "A conversation with our Founder and Managing Director to give you a clear sense of our direction, values, and leadership.",
    image: "/careers/founder.png",
    alt: "The United Carriers team standing in front of a truck",
  },
  {
    title: "Offer",
    body: "If it’s a mutual fit, we move fast. You’ll receive a formal offer with clear terms, and we’ll agree on a start date that makes sense for both sides.",
    image: "/careers/offer.webp",
    alt: "Air freight loaded beside an aircraft",
  },
];

export function CareersProcess() {
  const [active, setActive] = useState(0);
  const [resumeAt, setResumeAt] = useState(0);
  const interacted = useRef(false);
  const step = steps[active];

  function select(index: number) {
    interacted.current = true;
    setActive(index);
    setResumeAt(Date.now());
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let interval = 0;
    const start = () => {
      interval = window.setInterval(() => {
        setActive((current) => (current + 1) % steps.length);
      }, 3000);
    };

    if (!interacted.current) {
      start();
      return () => window.clearInterval(interval);
    }

    const timeout = window.setTimeout(start, 3000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [resumeAt]);

  return (
    <section className="bg-white text-neutral-950">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <p className="text-[10px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
          Our hiring process
        </p>
        <h2 className="mt-4 max-w-3xl text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase">
          Five steps from application to offer
        </h2>

        <div className="relative mt-16">
          <div className="absolute top-[1.05rem] right-[10%] left-[10%] h-px bg-neutral-200" />
          <div
            className="absolute top-[1.05rem] left-[10%] h-px bg-neutral-950 transition-[width] duration-500 ease-out"
            style={{ width: `${(active / (steps.length - 1)) * 80}%` }}
          />
          <ol className="relative grid grid-cols-5">
            {steps.map((item, index) => {
              const current = index === active;
              return (
                <li key={item.title}>
                  <button
                    type="button"
                    className="flex w-full flex-col items-center gap-4 text-center"
                    aria-current={current ? "step" : undefined}
                    onMouseEnter={() => select(index)}
                    onFocus={() => select(index)}
                    onClick={() => select(index)}
                  >
                    <span
                      className={`grid size-9 place-items-center rounded-full border text-[11px] tracking-[0.08em] transition-colors duration-300 ${
                        current
                          ? "border-neutral-950 bg-neutral-950 text-white"
                          : "border-neutral-300 bg-white text-neutral-500"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`hidden max-w-[9rem] text-[11px] leading-4 font-medium tracking-[0.08em] uppercase transition-colors duration-300 sm:block ${
                        current ? "text-neutral-950" : "text-neutral-400"
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div
          key={active}
          className="careers-step mt-16 grid items-center gap-8 border-t border-neutral-200 pt-10 sm:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(240px,380px)] lg:gap-16"
        >
          <div className="grid items-end gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-12">
            <p className="text-[clamp(5.5rem,14vw,10rem)] leading-none font-black tracking-[-0.07em]">
              {String(active + 1).padStart(2, "0")}
            </p>
            <div className="max-w-xl pb-2 lg:pb-6">
              <h3 className="text-[clamp(1.8rem,3.4vw,3rem)] leading-[0.95] font-bold tracking-[-0.04em] uppercase">
                {step.title}
              </h3>
              <p className="mt-5 text-sm leading-6 text-neutral-600 sm:text-[15px]">
                {step.body}
              </p>
            </div>
          </div>
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
            <Image
              src={step.image}
              alt={step.alt}
              fill
              sizes="(min-width: 1024px) 380px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
