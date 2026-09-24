const reasons = [
  {
    title: "One point of contact",
    body: "No more chasing multiple vendors. One team manages your entire shipment from origin to destination.",
  },
  {
    title: "Full supply chain visibility",
    body: "Track your freight in real time and get proactive updates before issues become delays.",
  },
  {
    title: "Compliance you can trust",
    body: "Our licensed customs brokers keep your shipments moving within every regulatory requirement across APAC.",
  },
  {
    title: "Competitive, transparenalot pricing",
    body: "No hidden fees. Clear, competitive pricing backed by responsive sales support throughout the shipment.",
  },
  {
    title: "Fast issue resolution",
    body: "When something unexpected happens, we do not point fingers — we solve it. Our team acts immediately to protect your timeline.",
  },
];

export function HomeWhy() {
  return (
    <section className="bg-white text-neutral-950">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <p className="text-[11px] font-medium tracking-[0.2em] text-zinc-500 uppercase">
          Why us
        </p>
        <h2 className="mt-4 max-w-3xl text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase">
          Logistics that works as hard as you do.
        </h2>
        <ul className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {reasons.map((reason, index) => (
            <li key={reason.title} className="border-t border-neutral-950/15 pt-5">
              <p className="text-[11px] tracking-[0.16em] text-zinc-500">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-lg font-medium tracking-tight uppercase">
                {reason.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600">
                {reason.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
