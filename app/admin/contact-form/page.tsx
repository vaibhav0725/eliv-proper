import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/backend/auth";
import { listContactEnquiries } from "@/backend/contact-enquiries-store";
import { AdminContactEnquiries } from "@/components/admin-contact-enquiries";
import { AdminShell } from "@/components/admin-shell";

export const metadata: Metadata = {
  title: "Contact form",
};

export const dynamic = "force-dynamic";

export default async function AdminContactFormPage() {
  if (!(await isAdminSession())) {
    redirect("/admin/login");
  }

  const enquiries = await listContactEnquiries();

  return (
    <AdminShell
      title="Contact form"
      description="Enquiries sent from the appointment form on the contact page."
    >
      <AdminContactEnquiries initialEnquiries={enquiries} />
    </AdminShell>
  );
}
