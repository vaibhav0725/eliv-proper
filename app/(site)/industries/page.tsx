import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Industries",
  description: "Industries Eli works with.",
};

export default function IndustriesPage() {
  return (
    <PageIntro
      title="Industries"
      description="The markets and sectors we serve."
    />
  );
}
