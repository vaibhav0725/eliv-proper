import { JsonLd } from "@/components/json-ld";
import { ContactBooking } from "@/components/contact-booking";
import { ContactHero } from "@/components/contact-hero";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

const title = "Contact";
const description =
  "Talk to Eliv Logistics at Five Greentree Centre, Marlton, NJ. Call +1 (646) 249-8054 or email info@elivlogistics.com. We reply within one business day.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: title, path: "/contact" },
          ]),
          faqJsonLd(),
        ]}
      />
      <ContactHero />
      <ContactBooking />
    </>
  );
}
