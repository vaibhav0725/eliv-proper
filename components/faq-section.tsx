"use client";

import { useState } from "react";
import { faqs } from "@/lib/faqs";

export function FaqSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="bg-white text-neutral-950">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center sm:px-10 lg:py-24">
        <h2 className="text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase">
          Frequently asked questions
        </h2>

        <ul className="mt-14 flex flex-col gap-4 text-left">
          {faqs.map((faq, index) => {
            const open = index === active;
            return (
              <li key={faq.question}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setActive(open ? null : index)}
                  className="flex w-full flex-col bg-[#f3f3f1] px-6 py-6 text-left"
                >
                  <span className="flex items-start justify-between gap-6">
                    <span className="text-[15px] leading-snug font-medium">
                      {faq.question}
                    </span>
                    <span aria-hidden className="text-lg leading-none text-zinc-400">
                      {open ? "–" : "+"}
                    </span>
                  </span>
                  {open ? (
                    <span className="mt-4 block text-sm leading-6 text-zinc-600">
                      {faq.answer}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
