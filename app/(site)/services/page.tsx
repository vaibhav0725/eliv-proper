import { JsonLd } from "@/components/json-ld";
import { ServicesHero } from "@/components/services-hero";
import { ServicesLogistics } from "@/components/services-logistics";
import { ServicesScroll } from "@/components/services-scroll";
import { ServicesTechnology } from "@/components/services-technology";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  servicesJsonLd,
} from "@/lib/seo";

const title = "Services";
const description =
  "Air, ocean, road, and project cargo, plus customs brokerage, warehousing, and domestic transport. One Eliv Logistics team from booking to proof of delivery.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: title, path: "/services" },
          ]),
          servicesJsonLd(),
          faqJsonLd(),
        ]}
      />
      <ServicesHero />
      <ServicesTechnology />
      <ServicesLogistics />
      <ServicesScroll />
    </>
  );
}
