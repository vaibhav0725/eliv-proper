import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Services",
  description: "Services offered by Eli.",
};

export default function ServicesPage() {
  return (
    <PageIntro
      title="Services"
      description="The work we do and how we help clients."
    />
  );
}
