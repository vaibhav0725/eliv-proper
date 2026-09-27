import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { listApplications } from "@/backend/applications-store";
import { isAdminSession } from "@/backend/auth";
import { AdminShell } from "@/components/admin-shell";
import { AdminSubmissions } from "@/components/admin-submissions";

export const metadata: Metadata = {
  title: "Form submissions",
};

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }

  const applications = await listApplications();

  return (
    <AdminShell
      title="Form submissions"
      description="Applications sent from the careers page, including the PDF resume."
    >
      <AdminSubmissions initialApplications={applications} />
    </AdminShell>
  );
}
