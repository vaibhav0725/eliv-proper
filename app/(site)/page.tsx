import { HomeHero } from "@/components/home-hero";
import { HomeIntro } from "@/components/home-intro";
import { HomePartners } from "@/components/home-partners";
import { HomeServices } from "@/components/home-services";
import { HomeTestimonials } from "@/components/home-testimonials";
import { HomeWhy } from "@/components/home-why";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeIntro />
      <HomeServices />
      <HomeWhy />
      <HomeTestimonials />
      <HomePartners />
    </>
  );
}
