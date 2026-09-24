"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

const sentence =
  "United Carriers moves freight across Australia, New Zealand, Hong Kong, and China. Air, ocean, road, and project cargo stay with one team from pickup to delivery, with customs, warehousing, and domestic transport on the same file.";

const facts = [
  { label: "Markets", value: "AU · NZ · HK · CN" },
  { label: "Modes", value: "Air, ocean, road, project" },
  { label: "Standard", value: "Australian Trusted Trader" },
  { label: "Handoffs", value: "One team, start to finish" },
];

function Word({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, range, [0.16, 1]);

  if (reduce) {
    return <span className="mr-[0.28em] inline-block">{word}</span>;
  }

  return (
    <motion.span style={{ opacity }} className="mr-[0.28em] inline-block">
      {word}
    </motion.span>
  );
}

export function AboutManifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const words = sentence.split(" ");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.45"],
  });

  return (
    <section ref={ref} className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-[1440px] px-6 py-24 sm:px-10 lg:px-14 lg:py-36">
        <p className="text-[11px] font-medium tracking-[0.22em] text-white/45 uppercase">
          The company
        </p>
        <p className="mt-8 max-w-5xl text-[clamp(1.7rem,3.6vw,3.35rem)] leading-[1.18] font-medium tracking-[-0.03em]">
          {words.map((word, index) => {
            const start = index / words.length;
            const end = start + 1 / words.length;
            return (
              <Word
                key={`${word}-${index}`}
                word={word}
                progress={scrollYProgress}
                range={[start, end]}
              />
            );
          })}
        </p>

        <dl className="mt-20 grid gap-px border-t border-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact, index) => (
            <motion.div
              key={fact.label}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.55,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="border-b border-white/15 py-6 pr-6 lg:border-b-0"
            >
              <dt className="text-[11px] tracking-[0.18em] text-white/40 uppercase">
                {fact.label}
              </dt>
              <dd className="mt-3 text-lg leading-snug font-medium tracking-tight">
                {fact.value}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
