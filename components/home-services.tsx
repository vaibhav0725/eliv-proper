import Link from "next/link";

const services = [
  {
    title: "Air freight",
    body: "Express, priority, and deferred options across global trade lanes — managed end to end for speed and schedule integrity.",
  },
  {
    title: "Ocean freight",
    body: "FCL, LCL, and specialised cargo movements, with structured carrier selection and routing for cost and reliability.",
  },
  {
    title: "Customs brokerage",
    body: "In-house licensed brokerage covering classification, compliance, and quarantine — full control, no outsourcing.",
  },
  {
    title: "Warehousing and 3PL",
    body: "Scalable storage, pick and pack, and distribution — fully integrated with freight and transport operations.",
  },
  {
    title: "Project cargo",
    body: "Specialist handling for oversized and complex shipments — from permits to engineered load configurations.",
  },
  {
    title: "Domestic & interstate transport",
    body: "Local, metro, and interstate transport managed for consistent service levels and full delivery visibility.",
  },
];

export function HomeServices() {
  return (
    <section className="bg-white text-neutral-950">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.7fr)] lg:items-end">
          <h2 className="text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase">
            Everything your freight needs. Under one group.
          </h2>
          <div className="text-sm leading-6 text-zinc-600">
            <p>
              From air to sea, from customs clearance to final delivery, we
              bring decades of expertise across every freight discipline.
            </p>
            <p className="mt-4">
              Our integrated service network means one partner, one point of
              contact, and total visibility from origin to destination.
            </p>
          </div>
        </div>

        <ul className="mt-14 border-t border-neutral-950/15">
          {services.map((service, index) => (
            <li
              key={service.title}
              className="grid gap-3 border-b border-neutral-950/15 py-6 sm:grid-cols-[4rem_minmax(0,16rem)_1fr] sm:items-baseline sm:gap-8"
            >
              <span className="text-[11px] tracking-[0.16em] text-zinc-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-medium tracking-tight uppercase">
                {service.title}
              </h3>
              <p className="max-w-xl text-sm leading-6 text-zinc-600">
                {service.body}
              </p>
            </li>
          ))}
        </ul>

        <Link
          href="/services"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-neutral-950 px-5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase"
        >
          Our services
        </Link>
      </div>
    </section>
  );
}
