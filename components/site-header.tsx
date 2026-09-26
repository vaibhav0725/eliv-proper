"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Text3DFlip from "@/components/ui/text-3d-flip";
import { navItems } from "@/lib/nav";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-4">
      <div
        className={`pointer-events-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-white/10 px-1.5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-colors duration-300 ${
          scrolled ? "bg-[#14161e]/80" : "bg-[#14161e]/60"
        }`}
      >
        <Link
          href="/"
          className="relative z-50 flex h-11 shrink-0 items-center rounded-full bg-white px-2.5"
          aria-label="ELIV Logistics"
        >
          <Image
            src="/logo.png"
            alt=""
            width={554}
            height={518}
            priority
            className="h-9 w-auto object-contain"
          />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex flex-col items-center gap-1 text-[11px] font-medium tracking-[0.16em] uppercase ${
                  active ? "text-white" : "text-white/65 hover:text-white"
                }`}
              >
                <Text3DFlip
                  as="span"
                  rotateDirection="top"
                  staggerDuration={0.03}
                >
                  {item.label}
                </Text3DFlip>
                <span
                  aria-hidden
                  className={`h-px w-4 ${active ? "bg-white" : "bg-transparent"}`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden h-11 items-center rounded-full bg-[#e6d3b4] px-5 text-[11px] font-semibold tracking-[0.14em] text-neutral-950 uppercase lg:inline-flex"
          >
            <Text3DFlip
              as="span"
              rotateDirection="top"
              staggerDuration={0.03}
            >
              Get a quote
            </Text3DFlip>
          </Link>
          <button
            type="button"
            className="relative z-50 inline-flex h-10 w-10 items-center justify-center text-white lg:hidden"
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
          className="pointer-events-auto fixed inset-0 z-40 flex h-dvh w-full flex-col justify-start bg-[#101218]/88 px-6 pt-24 pb-10 text-white backdrop-blur-xl lg:hidden"
        >
          <ul className="flex flex-col">
            {navItems.map((item, index) => {
              const active = isActive(pathname, item.href);
              return (
                <li
                  key={item.href}
                  className={index === 0 ? "" : "border-t border-current/15"}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="flex items-baseline justify-between py-4"
                    onClick={() => setOpen(false)}
                  >
                    <Text3DFlip
                      as="span"
                      rotateDirection="top"
                      staggerDuration={0.02}
                      className="text-[clamp(2.4rem,10vw,3.4rem)] leading-none font-bold tracking-[-0.04em] uppercase"
                    >
                      {item.label}
                    </Text3DFlip>
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
            className="mt-8 inline-flex h-12 w-fit items-center rounded-full bg-[#e6d3b4] px-6 text-[11px] font-semibold tracking-[0.14em] text-neutral-950 uppercase"
            onClick={() => setOpen(false)}
          >
            <Text3DFlip
              as="span"
              rotateDirection="top"
              staggerDuration={0.03}
            >
              Get a quote
            </Text3DFlip>
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
