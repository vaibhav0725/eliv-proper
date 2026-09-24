import type { Metadata } from "next";
import { AboutHero } from "@/components/about-hero";
import { AboutManifesto } from "@/components/about-manifesto";
import { AboutPrinciples } from "@/components/about-principles";
import { AboutStory } from "@/components/about-story";

export const metadata: Metadata = {
  title: "About",
  description:
    "United Carriers keeps every freight file with one team, from the first booking to proof of delivery across Australia, New Zealand, Hong Kong, and China.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutManifesto />
      <AboutStory />
      <AboutPrinciples />
    </>
  );
}
