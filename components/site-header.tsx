"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/nav";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function usesDarkBar(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/industries") ||
    pathname.startsWith("/careers")
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dark = usesDarkBar(pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 ${
        dark
          ? "bg-black text-white"
          : "border-b border-black/8 bg-[#f7f6f3]/90 text-neutral-950 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-6 px-6 sm:px-10 lg:px-14">
        <Link
          href="/"
          className="relative z-50 flex items-center gap-2.5 text-[15px] font-semibold tracking-[0.22em]"
        >
          <span
            aria-hidden
            className="inline-block size-2 bg-[#f97316]"
          />
          ELIV
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-[11px] font-medium tracking-[0.18em] uppercase transition-opacity ${
                  active
                    ? "opacity-100"
                    : dark
                      ? "text-white/55 hover:text-white"
                      : "text-neutral-500 hover:text-neutral-950"
                }`}
              >
                <span
                  className={
                    active
                      ? "border-b border-current pb-1"
                      : "pb-1"
                  }
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className={`hidden h-10 items-center rounded-full px-5 text-[11px] font-semibold tracking-[0.16em] uppercase md:inline-flex ${
              dark
                ? "bg-white text-black"
                : "bg-neutral-950 text-white"
            }`}
          >
            Get a quote
          </Link>
          <button
            type="button"
            className="relative z-50 inline-flex h-10 w-10 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="flex w-5 flex-col gap-1.5">
              <span
                className={`block h-px w-full bg-current transition-transform ${
                  open ? "translate-y-[3.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-full bg-current transition-transform ${
                  open ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className={`fixed inset-0 z-40 flex flex-col justify-end px-6 pt-24 pb-10 md:hidden ${
            dark ? "bg-black text-white" : "bg-[#f7f6f3] text-neutral-950"
          }`}
        >
          <ul className="flex flex-col">
            {navItems.map((item, index) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="border-t border-current/15">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="flex items-baseline justify-between py-4"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-[clamp(2.4rem,10vw,3.4rem)] leading-none font-bold tracking-[-0.04em] uppercase">
                      {item.label}
                    </span>
                    <span className="text-[11px] tracking-[0.16em] opacity-40">
                      0{index + 1}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/contact"
            className={`mt-8 inline-flex h-12 w-fit items-center rounded-full px-6 text-[11px] font-semibold tracking-[0.16em] uppercase ${
              dark ? "bg-white text-black" : "bg-neutral-950 text-white"
            }`}
            onClick={() => setOpen(false)}
          >
            Get a quote
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
