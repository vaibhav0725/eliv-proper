import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/backend/auth";
import { listJobs } from "@/backend/jobs-store";
import { AdminJobPortal } from "@/components/admin-job-portal";

export const metadata: Metadata = {
  title: "Job portal",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }

  const jobs = await listJobs();
  return <AdminJobPortal initialJobs={jobs} />;
}
