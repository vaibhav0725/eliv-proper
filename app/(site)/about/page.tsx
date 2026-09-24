import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Eli.",
};

export default function AboutPage() {
  return (
    <PageIntro
      title="About"
      description="Who we are, what we stand for, and how we work."
    />
  );
}
