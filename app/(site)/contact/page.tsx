import type { Metadata } from "next";
import { ContactBooking } from "@/components/contact-booking";
import { ContactHero } from "@/components/contact-hero";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Write to United Carriers in Melbourne, Auckland, Hong Kong, or Shenzhen. We reply within one business day.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactBooking />
    </>
  );
}
