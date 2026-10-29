import { JsonLd } from "@/components/json-ld";
import { HomeHero } from "@/components/home-hero";
import { HomeIndustries } from "@/components/home-industries";
import { HomeLanes } from "@/components/home-lanes";
// import { HomePartners } from "@/components/home-partners";
import { HomeServices } from "@/components/home-services";
import { JourneyShowcase } from "@/components/sections/journey-showcase";
import { absoluteUrl, defaultTitle, pageMetadata, siteDescription, siteUrl } from "@/lib/seo";

export const metadata = pageMetadata({
  title: defaultTitle,
  description: siteDescription,
  path: "/",
  absolute: true,
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: defaultTitle,
          description: siteDescription,
          url: absoluteUrl("/"),
          isPartOf: { "@id": `${siteUrl}/#website` },
          about: { "@id": `${siteUrl}/#organization` },
        }}
      />
      <HomeHero />
      <JourneyShowcase />
      <HomeLanes />
      <HomeServices />
      <HomeIndustries />
      {/* <HomePartners /> */}
    </>
  );
}
