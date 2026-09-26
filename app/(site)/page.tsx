import { HomeHero } from "@/components/home-hero";
import { HomeIndustries } from "@/components/home-industries";
import { HomeLanes } from "@/components/home-lanes";
import { HomePartners } from "@/components/home-partners";
import { HomeServices } from "@/components/home-services";
import { HomeYard } from "@/components/home-yard";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeYard />
      <HomeLanes />
      <HomeServices />
      <HomeIndustries />
      <HomePartners />
    </>
  );
}
