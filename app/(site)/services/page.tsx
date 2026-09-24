import type { Metadata } from "next";
import { ServicesHero } from "@/components/services-hero";

export const metadata: Metadata = {
  title: "Services",
  description: "Global supply chain coverage, freight, and logistics.",
};

export default function ServicesPage() {
  return <ServicesHero />;
}
