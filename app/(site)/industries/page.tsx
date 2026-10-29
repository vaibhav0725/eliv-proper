import { JsonLd } from "@/components/json-ld";
import { IndustriesHero } from "@/components/industries-hero";
import { IndustriesList } from "@/components/industries-list";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const title = "Industries";
const description =
  "Logistics for fashion, healthcare, retail, technology, energy, mining, construction, and automotive freight across Australia, New Zealand, Hong Kong, and China.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: title, path: "/industries" },
        ])}
      />
      <IndustriesHero />
      <IndustriesList />
    </>
  );
}
