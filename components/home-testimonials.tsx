const quotes = [
  {
    name: "Thomas Munro",
    role: "Director at Picha Group",
    quote:
      "My business wouldn't function without this team. Extremely talented with immense experience tailoring each consignment based on its merits. We have our dedicated account managers that know our business, are responsive and provide personalised service which we never had with bigger companies. UC for the win.",
  },
  {
    name: "Francis Fung",
    role: "APAC Supply Chain Operations Director at Commscope",
    quote:
      "As a first time supplier shipping equipment to support one of the major Australian infrastructure projects I came up against uncharted territories. Looking back I really appreciate Chris' effort in helping a potential customer understand what is required and how to go about the execution. Our first time right delivery was no coincidence. It was Chris' relentless attention to details and pro-active monitoring of the process that ensured a smooth dock to dock delivery.",
  },
  {
    name: "Alex Hughes",
    role: "Senior Management at Factory X",
    quote:
      "I worked closely with Chris over several years to build a seamless, cost effective supply chain for one of Australia's largest fashion retail companies. Chris was not only able to help us streamline our operations throughout Asia and shorten our time to market, but through his willingness to negotiate great rates on our behalf, also provide significant cost savings.",
  },
];

export function HomeTestimonials() {
  return (
    <section className="bg-[#f7f7f5] text-neutral-950">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center sm:px-10 lg:py-24">
        <h2 className="text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase">
          Trusted by businesses across APAC
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-zinc-600">
          From first-time importers to high-volume shippers, our customers keep
          coming back because we treat their freight like our own.
        </p>
        <ul className="mt-14 flex flex-col gap-6 text-left">
          {quotes.map((item) => (
            <li key={item.name} className="bg-white px-6 py-8">
              <p className="text-sm leading-6 text-zinc-700">{item.quote}</p>
              <p className="mt-6 text-sm font-medium">{item.name}</p>
              <p className="mt-1 text-xs tracking-wide text-zinc-500 uppercase">
                {item.role}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
