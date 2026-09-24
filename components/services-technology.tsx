"use client";

import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

const platforms = [
  {
    name: "CargoWise",
    image: "/services/cargowise.jpg",
    alt: "A map used to track international shipments",
    body: "Our international freight and customs operations are managed through CargoWise, enabling full documentation control, regulatory compliance, shipment tracking via our client portal, and financial accuracy across global movements.",
  },
  {
    name: "MachShip",
    image: "/services/machship.jpg",
    alt: "A transport dashboard with live rates and tracking",
    body: "United Carriers provides clients with a streamlined domestic transport portal, giving access to live rates, seamless booking, real-time tracking, and delivery updates across land transport. Through MachShip, our aggregator platform, clients benefit from our established carrier contracts and transport network.",
  },
];

export function ServicesTechnology() {
  return (
    <section className="bg-white px-6 py-20 text-neutral-950 sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-[clamp(2.6rem,5.4vw,4.75rem)] leading-[0.9] font-bold tracking-[-0.04em] uppercase">
          <span className="text-[#b5b5b5]">Technology-</span>
          <br />
          Driven operations
          <br />
          &amp; visibility
        </h2>
        <p className="mx-auto mt-8 max-w-md text-[14px] leading-relaxed text-neutral-600">
          Every service delivered by United Carriers is supported by advanced,
          integrated technology platforms that provide structure, control, and
          transparency across the supply chain.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-10">
        {platforms.map((platform) => (
          <CardContainer key={platform.name} containerClassName="w-full">
            <CardBody className="w-full rounded-2xl border border-black/8 bg-white p-3 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)]">
              <CardItem translateZ={48} className="w-full">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-950">
                  <Image
                    src={platform.image}
                    alt={platform.alt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </CardItem>
              <CardItem
                translateZ={32}
                className="mt-6 w-full px-3 text-[15px] font-bold tracking-[0.08em] uppercase"
              >
                {platform.name}
              </CardItem>
              <CardItem
                as="p"
                translateZ={20}
                className="mt-3 w-full px-3 pb-4 text-[14px] leading-relaxed text-neutral-600"
              >
                {platform.body}
              </CardItem>
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </section>
  );
}
