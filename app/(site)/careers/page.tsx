import { listPublicJobs } from "@/backend/jobs-store";
import { JsonLd } from "@/components/json-ld";
import { CareersHero } from "@/components/careers-hero";
import { CareersJobs } from "@/components/careers-jobs";
import { CareersProcess } from "@/components/careers-process";
import { CareersWhy } from "@/components/careers-why";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

const title = "Careers";
const description =
  "Join Eliv Logistics. Roles across Australia, New Zealand, Hong Kong, and China for people who want ownership of the file, from booking through to delivery.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/careers",
});

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const jobs = await listPublicJobs();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: title, path: "/careers" },
        ])}
      />
      <CareersHero />
      <CareersWhy />
      <CareersProcess />
      <CareersJobs jobs={jobs} />
    </>
  );
}
