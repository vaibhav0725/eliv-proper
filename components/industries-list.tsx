import Image from "next/image";

const industries = [
  {
    title: "Fashion & Footwear",
    headline:
      "Fast-moving logistics for fashion supply chains that can’t afford delays",
    image: "/industries/fashion.png",
    alt: "Shoppers in a fashion and footwear store",
    paragraphs: [
      "Fashion supply chains are time-sensitive. Seasonal collections, retail launch windows, and trend cycles mean delays don’t just impact operations — they impact brand momentum and market relevance.",
      "From sourcing to final-mile distribution, we help fashion and footwear brands move inventory quickly, accurately, and efficiently across domestic and international markets.",
    ],
    reasons: [
      "Time-critical delivery for seasonal launches",
      "Multi-market customs & retail distribution support",
      "Real-time shipment visibility across the supply chain",
    ],
  },
  {
    title: "Medical & Healthcare",
    headline:
      "Precision logistics for critical healthcare and medical supply chains",
    image: "/industries/medical.webp",
    alt: "Temperature-controlled medical shipping kit",
    paragraphs: [
      "Medical freight demands absolute accuracy, strict compliance, and zero margin for delay. In healthcare logistics, every shipment carries operational, regulatory, and patient-critical importance.",
      "We support hospitals, laboratories, pharmaceutical suppliers, and healthcare distributors with secure, time-sensitive transport solutions across domestic and international networks.",
    ],
    reasons: [
      "Temperature-controlled and time-critical delivery",
      "Full regulatory and compliance coordination",
      "Secure chain-of-custody shipment management",
    ],
  },
  {
    title: "Retail (including fitout)",
    headline:
      "Coordinated retail logistics built for fast rollouts and store-ready delivery",
    image: "/industries/retail.png",
    alt: "Retail store interior",
    paragraphs: [
      "Retail logistics depends on precise timing across inventory, fitout materials, and launch schedules. A delayed shipment doesn’t just impact freight movement — it delays store openings, product availability, and customer experience.",
      "We support retailers, franchise networks, and commercial fitout teams with scalable logistics solutions designed for high-volume distribution and multi-location execution.",
    ],
    reasons: [
      "Store-ready delivery with precise rollout scheduling",
      "Specialist handling for fixtures, signage, and fitout materials",
      "Multi-location retail distribution and replenishment support",
    ],
  },
  {
    title: "Technology & Electronics",
    headline:
      "Secure, time-critical logistics for high-value technology supply chains",
    image: "/industries/technology.png",
    alt: "Technology and electronics products",
    paragraphs: [
      "Technology logistics demands speed, precision, and secure handling across every stage of the supply chain. From consumer electronics to enterprise hardware and semiconductor components, delays or compliance errors can disrupt product launches and market delivery timelines.",
      "We support technology brands with scalable freight and distribution solutions designed for high-value cargo, rapid deployment, and global supply chain visibility.",
    ],
    reasons: [
      "Secure handling for high-value technology cargo",
      "Fast-track customs and pre-launch coordination",
      "Real-time visibility across global technology supply chains",
    ],
  },
  {
    title: "Energy & Renewables",
    headline:
      "Specialist logistics for large-scale renewable energy and infrastructure projects",
    image: "/industries/energy.png",
    alt: "Renewable energy infrastructure",
    paragraphs: [
      "Renewable energy projects depend on precise coordination across oversized cargo, remote delivery locations, and construction-driven timelines. From solar infrastructure to wind energy components, delays can impact critical project milestones and operational deployment.",
      "We support renewable energy developers, EPC contractors, and infrastructure partners with end-to-end logistics solutions tailored for complex project cargo movements.",
    ],
    reasons: [
      "Specialist handling for oversized and project cargo",
      "End-to-end coordination across multimodal transport networks",
      "Freight planning aligned with construction and deployment timelines",
    ],
  },
];


export function IndustriesList() {
  return (
    <section className="bg-black">
      {industries.map((industry, index) => (
        <article key={industry.title}>
          <div className="sticky top-16 z-30 bg-white">
            <div className="flex items-center gap-4 border-b border-black/10 bg-white px-6 py-4 text-neutral-950 sm:px-10 lg:px-14">
              <p className="w-10 shrink-0 text-sm text-zinc-500">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="flex-1 text-center text-[clamp(1.15rem,2vw,1.65rem)] leading-tight font-bold tracking-tight uppercase">
                {industry.title}
              </h2>
              <span className="w-10 shrink-0" aria-hidden />
            </div>
          </div>
          <div className="grid items-center gap-8 bg-black px-6 py-12 text-white sm:px-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:gap-x-16 lg:px-14 lg:py-16">
            <div>
            <div className="space-y-4 text-sm leading-6 text-zinc-300">
              {industry.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-8 border-t border-white/20 pt-4 text-[10px] tracking-[0.16em] text-zinc-400 uppercase">
              Why choose us
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-6 text-zinc-200">
              {industry.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 aspect-[16/10] overflow-hidden lg:aspect-[16/11]">
            <Image
              src={industry.image}
              alt={industry.alt}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
          </div>
        </article>
      ))}
    </section>
  );
}
