import type { Metadata } from "next";
import { CareersHero } from "@/components/careers-hero";
import { CareersJobs } from "@/components/careers-jobs";
import { CareersProcess } from "@/components/careers-process";
import { CareersWhy } from "@/components/careers-why";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join United Carriers. Growing fast across APAC, looking for driven people who value impact and accountability.",
};

export default function CareersPage() {
  return (
    <>
      <CareersHero />
      <CareersWhy />
      <CareersProcess />
      <CareersJobs />
    </>
  );
}
