import { JsonLd } from "@/components/json-ld";
import { AboutHero } from "@/components/about-hero";
import { AboutManifesto } from "@/components/about-manifesto";
import { AboutPrinciples } from "@/components/about-principles";
import { AboutStory } from "@/components/about-story";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

const title = "About";
const description =
  "Eliv Logistics keeps every freight file with one team, from the first booking to proof of delivery across Australia, New Zealand, Hong Kong, and China.";

export const metadata = pageMetadata({ title, description, path: "/about" });

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: title, path: "/about" },
          ]),
          faqJsonLd(),
        ]}
      />
      <AboutHero />
      <AboutManifesto />
      <AboutStory />
      <AboutPrinciples />
    </>
  );
}
