"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const lines = ["Get", "in touch"];

const details = [
  {
    label: "Phone",
    value: "1300 000 082",
    href: "tel:1300000082",
  },
  {
    label: "Email",
    value: "contact@unitedcarriers.com",
    href: "mailto:contact@unitedcarriers.com",
  },
  {
    label: "Hours",
    value: "Weekdays, 8:30 – 17:00",
  },
  {
    label: "LinkedIn",
    value: "United Carriers APAC",
    href: "https://www.linkedin.com/company/united-carriers-apac/",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function ContactHero() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-[#101218] text-white">
      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-12 px-6 pt-28 pb-16 sm:px-10 lg:min-h-svh lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 lg:px-14 lg:pt-32 lg:pb-20">
        <div className="@container max-w-xl">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-[11px] font-medium tracking-[0.22em] text-white/55 uppercase"
          >
            Contact
          </motion.p>

          <h1 className="mt-5 text-[clamp(3.25rem,20cqi,6.75rem)] leading-[0.82] font-black tracking-[-0.055em] uppercase">
            {lines.map((line, index) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "115%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.95,
                    delay: 0.08 + index * 0.1,
                    ease,
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="mt-8 max-w-md text-[15px] leading-relaxed text-white/75"
          >
            Four offices, one desk. Write with the lane, the cargo, and the
            timing. A reply comes back within one business day.
          </motion.p>

          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.52, ease }}
            className="mt-12 grid gap-x-8 gap-y-7 border-t border-white/15 pt-8 sm:grid-cols-2"
          >
            {details.map((item) => (
              <div key={item.label}>
                <dt className="text-[10px] font-medium tracking-[0.18em] text-white/40 uppercase">
                  {item.label}
                </dt>
                <dd className="mt-2 text-sm leading-6 text-white">
                  {item.href ? (
                    <a
                      href={item.href}
                      className="underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-white"
                    >
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.figure
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="lg:py-6"
        >
          <div className="relative aspect-[3/2] overflow-hidden bg-white/5">
            <Image
              src="/contact-team.png"
              alt="United Carriers team in front of a company truck"
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-4 flex items-center justify-between gap-4 text-[10px] font-medium tracking-[0.18em] text-white/40 uppercase">
            <span>Melbourne</span>
            <span>The desk you reach</span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
