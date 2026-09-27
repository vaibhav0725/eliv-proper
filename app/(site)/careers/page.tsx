import type { Metadata } from "next";
import { listPublicJobs } from "@/backend/jobs-store";
import { CareersHero } from "@/components/careers-hero";
import { CareersJobs } from "@/components/careers-jobs";
import { CareersProcess } from "@/components/careers-process";
import { CareersWhy } from "@/components/careers-why";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join United Carriers. Growing fast across APAC, looking for driven people who value impact and accountability.",
};

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const jobs = await listPublicJobs();

  return (
    <>
      <CareersHero />
      <CareersWhy />
      <CareersProcess />
      <CareersJobs jobs={jobs} />
    </>
  );
}
