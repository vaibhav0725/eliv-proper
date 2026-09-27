import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/backend/auth";
import { listLeads } from "@/backend/leads-store";
import { AdminEmailList } from "@/components/admin-email-list";
import { AdminShell } from "@/components/admin-shell";

export const metadata: Metadata = {
  title: "Book a call",
};

export const dynamic = "force-dynamic";

export default async function AdminBookACallPage() {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }

  const leads = await listLeads("book-a-call");

  return (
    <AdminShell
      title="Book a call"
      description="Emails submitted from the footer Book a call form."
    >
      <AdminEmailList
        initialLeads={leads}
        emptyLabel="No call requests yet."
      />
    </AdminShell>
  );
}
