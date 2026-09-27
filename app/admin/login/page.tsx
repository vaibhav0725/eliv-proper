import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/backend/auth";
import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata: Metadata = {
  title: "Admin login",
};

export default async function AdminLoginPage() {
  if (await isAdminSession()) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-16">
      <p className="text-[10px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
        Eli admin
      </p>
      <h1 className="mt-4 text-[clamp(2.2rem,6vw,3.4rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase">
        Sign in
      </h1>
      <p className="mt-4 text-sm leading-6 text-zinc-600">
        Manage jobs listed on the careers page.
      </p>
      <AdminLoginForm />
    </div>
  );
}
