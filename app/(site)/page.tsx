import { HomeHero } from "@/components/home-hero";
import { HomeIndustries } from "@/components/home-industries";
import { HomeIntro } from "@/components/home-intro";
import { HomeLanes } from "@/components/home-lanes";
import { HomePartners } from "@/components/home-partners";
import { HomeProcess } from "@/components/home-process";
import { HomeServices } from "@/components/home-services";
import { HomeTestimonials } from "@/components/home-testimonials";
import { HomeWhy } from "@/components/home-why";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeIntro />
      <HomeLanes />
      <HomeServices />
      <HomeProcess />
      <HomeWhy />
      <HomeIndustries />
      <HomeTestimonials />
      <HomePartners />
    </>
  );
}
