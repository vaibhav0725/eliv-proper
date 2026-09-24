import type { Metadata } from "next";
import { ContactBooking } from "@/components/contact-booking";
import { ContactHero } from "@/components/contact-hero";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with United Carriers.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactBooking />
    </>
  );
}
