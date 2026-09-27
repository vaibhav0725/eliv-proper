"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

const links = [
  { href: "/admin", label: "Job portal" },
  { href: "/admin/submissions", label: "Form submissions" },
  { href: "/admin/contact-form", label: "Contact form" },
  { href: "/admin/book-a-call", label: "Book a call" },
  { href: "/admin/consulting-call", label: "Consulting call" },
  { href: "/admin/newsletter", label: "Newsletter" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={`rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
              active
                ? "bg-white text-neutral-950"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-full">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-neutral-950 py-6 text-white lg:flex">
        <div className="px-6 pb-8">
          <p className="text-[10px] font-medium tracking-[0.18em] text-white/40 uppercase">
            Eli
          </p>
          <p className="mt-2 text-lg font-semibold tracking-tight">Admin</p>
        </div>
        {nav}
        <button
          type="button"
          onClick={logout}
          className="mx-3 mt-auto rounded-lg px-3 py-2.5 text-left text-[13px] text-white/50 hover:bg-white/10 hover:text-white"
        >
          Log out
        </button>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-neutral-950/40"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col bg-neutral-950 py-6 text-white">
            <div className="px-6 pb-8">
              <p className="text-[10px] font-medium tracking-[0.18em] text-white/40 uppercase">
                Eli
              </p>
              <p className="mt-2 text-lg font-semibold tracking-tight">Admin</p>
            </div>
            {nav}
            <button
              type="button"
              onClick={logout}
              className="mx-3 mt-auto rounded-lg px-3 py-2.5 text-left text-[13px] text-white/50 hover:bg-white/10 hover:text-white"
            >
              Log out
            </button>
          </aside>
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-4 border-b border-neutral-950/10 px-5 py-4 lg:hidden">
          <p className="text-sm font-semibold tracking-tight">Eli Admin</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-[11px] font-medium tracking-[0.14em] uppercase"
          >
            Menu
          </button>
        </header>
        <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <h1 className="text-[clamp(1.8rem,3vw,2.6rem)] leading-none font-bold tracking-[-0.04em] uppercase">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600">
            {description}
          </p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
