import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/backend/auth";
import { listConsultingCalls } from "@/backend/consulting-calls-store";
import { AdminConsultingCalls } from "@/components/admin-consulting-calls";
import { AdminShell } from "@/components/admin-shell";

export const metadata: Metadata = {
  title: "Consulting call",
};

export const dynamic = "force-dynamic";

export default async function AdminConsultingCallPage() {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }

  const calls = await listConsultingCalls();

  return (
    <AdminShell
      title="Consulting call"
      description="Requests sent from the Book a Consulting Call form on the home page."
    >
      <AdminConsultingCalls initialCalls={calls} />
    </AdminShell>
  );
}
