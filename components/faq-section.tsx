"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    number: "01",
    question: "What does United Carriers do?",
    answer:
      "United Carriers moves freight across Australia, New Zealand, Hong Kong, and China. That covers air, sea, road, and project cargo, handled by the same team from pickup to delivery.",
  },
  {
    number: "02",
    question: "What industries do you specialise in?",
    answer:
      "Equipment, mining and resources, building and construction, project cargo, retail, technology and electronics, energy and renewables, and automotive and industrial.",
  },
  {
    number: "03",
    question: "What shipping methods do you offer?",
    answer:
      "Air freight, sea freight, and road transport, including project logistics when the cargo is oversized, heavy, or time critical.",
  },
  {
    number: "04",
    question: "Do you provide customs clearance services?",
    answer:
      "Yes. Customs clearance is handled with the shipment, and the paperwork is prepared before the cargo moves.",
  },
  {
    number: "05",
    question: "How is freight pricing calculated?",
    answer:
      "Price depends on the mode, weight and volume, origin and destination, and any special handling. You get a quote before anything is booked.",
  },
  {
    number: "06",
    question: "Do you offer warehousing and 3PL services?",
    answer:
      "Yes. Warehousing and third-party logistics cover storage, pick and pack, and distribution from the same network.",
  },
  {
    number: "07",
    question: "Can you handle oversized or heavy cargo?",
    answer:
      "Yes. Oversized and heavy cargo is planned as project cargo, including the route, equipment, and permits.",
  },
  {
    number: "08",
    question: "How do I request a quote?",
    answer:
      "Email the team or call the hotline with origin, destination, cargo details, and timing. A quote comes back from the people who will move it.",
  },
];

export function FaqSection() {
  return (
    <section className="bg-white text-neutral-950">
      <div className="grid lg:grid-cols-3">
        <div className="px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
          <h2 className="text-5xl leading-none font-bold tracking-[-0.04em] sm:text-6xl">
            F.A.Q
          </h2>
          <p className="mt-8 max-w-[14rem] text-[14px] leading-snug text-neutral-500">
            Straightforward answers, so you can move forward with confidence.
          </p>
        </div>

        <div className="px-6 sm:px-10 lg:px-4 lg:py-16">
          <Accordion type="single" collapsible className="border-t border-black/10">
            {faqs.map((item) => (
              <AccordionItem
                key={item.number}
                value={item.number}
                className="border-b border-black/10"
              >
                <AccordionTrigger className="group flex w-full items-center gap-4 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-black/20 sm:gap-8 sm:py-5">
                  <span className="w-7 shrink-0 text-[13px] text-neutral-400 tabular-nums">
                    {item.number}
                  </span>
                  <span className="flex-1 text-[15px] leading-snug">
                    {item.question}
                  </span>
                  <span
                    aria-hidden
                    className="size-3.5 shrink-0 rounded-full border border-neutral-400 group-data-[state=open]:border-neutral-950"
                  />
                </AccordionTrigger>
                <AccordionContent>
                  <p className="pr-8 pb-5 pl-11 text-[14px] leading-relaxed text-neutral-500 sm:pl-[3.75rem]">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="px-6 py-14 sm:px-10 lg:px-12 lg:py-20">
          <p className="max-w-[12.5rem] text-[14px] leading-snug">
            Still have questions? Our team is here to help.
          </p>
          <a
            href="mailto:contact@unitedcarriers.com"
            className="mt-8 inline-block text-[12px] font-semibold tracking-[0.16em]"
          >
            EMAIL US
          </a>
        </div>
      </div>
    </section>
  );
}
