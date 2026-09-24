import type { Metadata } from "next";
import { IndustriesHero } from "@/components/industries-hero";
import { IndustriesList } from "@/components/industries-list";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Industries United Carriers moves, from mining and construction to retail, energy, and automotive freight.",
};

export default function IndustriesPage() {
  return (
    <>
      <IndustriesHero />
      <IndustriesList />
    </>
  );
}
