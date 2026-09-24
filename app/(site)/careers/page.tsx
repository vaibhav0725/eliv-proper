import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Careers",
  description: "Careers at Eli.",
};

export default function CareersPage() {
  return (
    <PageIntro
      title="Careers"
      description="Open roles and what it is like to work here."
    />
  );
}
