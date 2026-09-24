"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What does United Carriers do?",
    answer:
      "United Carriers moves freight across Australia, New Zealand, Hong Kong, and China. That covers air, sea, road, and project cargo, handled by the same team from pickup to delivery.",
  },
  {
    question: "What industries do you specialise in?",
    answer:
      "Equipment, mining and resources, building and construction, project cargo, retail, technology and electronics, energy and renewables, and automotive and industrial.",
  },
  {
    question: "What shipping methods do you offer?",
    answer:
      "Air freight, sea freight, and road transport, including project logistics when the cargo is oversized, heavy, or time critical.",
  },
  {
    question: "Do you provide customs clearance services?",
    answer:
      "Yes. Customs clearance is handled with the shipment, and the paperwork is prepared before the cargo moves.",
  },
  {
    question: "How is freight pricing calculated?",
    answer:
      "Price depends on the mode, weight and volume, origin and destination, and any special handling. You get a quote before anything is booked.",
  },
  {
    question: "Do you offer warehousing and 3PL services?",
    answer:
      "Yes. Warehousing and third-party logistics cover storage, pick and pack, and distribution from the same network.",
  },
  {
    question: "Can you handle oversized or heavy cargo?",
    answer:
      "Yes. Oversized and heavy cargo is planned as project cargo, including the route, equipment, and permits.",
  },
  {
    question: "How do I request a quote?",
    answer:
      "Email the team or call the hotline with origin, destination, cargo details, and timing. A quote comes back from the people who will move it.",
  },
];

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
