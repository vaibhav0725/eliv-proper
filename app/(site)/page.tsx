import { HomeHero } from "@/components/home-hero";
import { HomeIndustries } from "@/components/home-industries";
import { HomeLanes } from "@/components/home-lanes";
import { HomePartners } from "@/components/home-partners";
import { HomeServices } from "@/components/home-services";
import { ScrollVideoShowcase } from "@/components/sections/scroll-video-showcase";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <ScrollVideoShowcase />
      <HomeLanes />
      <HomeServices />
      <HomeIndustries />
      <HomePartners />
    </>
  );
}
