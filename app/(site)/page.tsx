import { HomeHero } from "@/components/home-hero";
import { HomeIndustries } from "@/components/home-industries";
import { HomeLanes } from "@/components/home-lanes";
import { HomePartners } from "@/components/home-partners";
import { HomeServices } from "@/components/home-services";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeLanes />
      <HomeServices />
      <HomeIndustries />
      <HomePartners />
    </>
  );
}
