import type { Metadata } from "next";
import { ServicesHero } from "@/components/services-hero";
import { ServicesLogistics } from "@/components/services-logistics";
import { ServicesScroll } from "@/components/services-scroll";
import { ServicesTechnology } from "@/components/services-technology";

export const metadata: Metadata = {
  title: "Services",
  description: "Global supply chain coverage, freight, and logistics.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesTechnology />
      <ServicesLogistics />
      <ServicesScroll />
    </>
  );
}
