import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/backend/auth";
import { listLeads } from "@/backend/leads-store";
import { AdminEmailList } from "@/components/admin-email-list";
import { AdminShell } from "@/components/admin-shell";

export const metadata: Metadata = {
  title: "Newsletter",
};

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }

  const leads = await listLeads("newsletter");

  return (
    <AdminShell
      title="Newsletter"
      description="Emails submitted from the footer newsletter form."
    >
      <AdminEmailList
        initialLeads={leads}
        emptyLabel="No newsletter sign-ups yet."
      />
    </AdminShell>
  );
}
