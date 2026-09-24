"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const companyColumns = [
  [
    { href: "/", label: "Home", accent: true },
    { href: "/about", label: "About us" },
    { href: "/careers", label: "Careers" },
  ],
  [
    { href: "/insights", label: "Insights" },
    { href: "/merchandise", label: "Merchandise" },
    { href: "/community", label: "Community" },
  ],
  [
    { href: "/industries", label: "Industries" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact us" },
  ],
] as const;

const industries = [
  "Equipment",
  "Mining & Resources",
  "Building & Construction",
  "Project Cargo",
  "Engineering",
  "Retail",
  "Technology & Electronics",
  "Energy & Renewables",
  "Automotive & Industrial",
];

const services = [
  "Air Freight",
  "Sea Freight",
  "Road Transport",
  "Warehousing",
  "Customs Clearance",
  "Project Logistics",
  "Supply Chain",
  "Dangerous Goods",
];

const legalLinks = [
  "QHSE",
  "Privacy Policy",
  "Terms & Conditions",
  "Payment Policy",
  "Delivery Policy",
  "Refund & Returns Policy",
  "Cookie Settings",
];

const labelClass =
  "text-[10px] font-medium tracking-[0.16em] text-zinc-400 uppercase";

export function SiteFooter() {
  const [lane, setLane] = useState<"industries" | "services">("industries");
  const marqueeItems = lane === "industries" ? industries : services;

  return (
    <footer className="flex flex-col border-t border-black/8 bg-white text-neutral-950 lg:h-svh lg:min-h-[760px] lg:overflow-hidden">
      <section className="flex flex-col lg:min-h-0 lg:flex-[1.15]">
        <div className="grid grid-cols-1 items-start gap-10 px-6 py-8 sm:px-8 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6 lg:px-10 lg:py-9">
          <div>
            <p className={labelClass}>Socials</p>
            <div className="mt-4 flex items-center gap-2.5">
              <SocialLink label="LinkedIn" href="https://www.linkedin.com">
                <LinkedInIcon />
              </SocialLink>
              <SocialLink label="Instagram" href="https://www.instagram.com">
                <InstagramIcon />
              </SocialLink>
              <SocialLink label="Facebook" href="https://www.facebook.com">
                <FacebookIcon />
              </SocialLink>
            </div>
          </div>

          <div className="lg:px-6">
            <p className={labelClass}>Company</p>
            <div className="mt-4 grid grid-cols-3 gap-x-8 sm:gap-x-14">
              {companyColumns.map((column) => (
                <ul key={column[0].href} className="flex flex-col gap-2.5">
                  {column.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`text-[13px] leading-none tracking-tight ${
                          "accent" in item && item.accent
                            ? "font-medium text-[#2f6bff]"
                            : "text-neutral-950 hover:text-neutral-600"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>

            <div className="lg:justify-self-end">
            <p className={labelClass}>Secure payments</p>
            <p className="mt-3 max-w-[230px] text-[11px] leading-[1.45] text-zinc-500">
              Payments secured via PCI-DSS compliant gateway.
              <br />
              Card details are not stored.
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              <CardBadge label="Visa">VISA</CardBadge>
              <MastercardBadge />
              <CardBadge label="Discover" className="text-[7px] tracking-tight text-orange-600">
                DISCOVER
              </CardBadge>
              <CardBadge label="American Express" className="text-[7px] text-sky-700">
                AMEX
              </CardBadge>
              <CardBadge label="JCB" className="text-[8px] text-blue-800">
                JCB
              </CardBadge>
              <CardBadge label="Diners Club" className="text-[7px] text-sky-800">
                DC
              </CardBadge>
              <CardBadge label="UnionPay" className="text-[7px] text-red-600">
                银联
              </CardBadge>
              <CardBadge label="Apple Pay" className="text-[8px]">
                Pay
              </CardBadge>
              <CardBadge label="Google Pay" className="text-[8px]">
                G Pay
              </CardBadge>
              <CardBadge label="Card" className="text-[9px]">
                ●
              </CardBadge>
            </div>
          </div>
        </div>

        <div className="relative border-b border-black/10">
          <button
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="absolute top-1/2 left-6 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/20 bg-white sm:left-8 lg:left-10"
          >
            <span className="size-1.5 rounded-full bg-neutral-950" />
          </button>

          <div className="pointer-events-none absolute top-0 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full bg-zinc-100 px-3.5 py-1.5 text-[10px] font-medium tracking-[0.16em]">
              <button
                type="button"
                onClick={() => setLane("industries")}
                className={
                  lane === "industries" ? "text-neutral-950" : "text-zinc-400"
                }
              >
                INDUSTRIES
              </button>
              <span className="text-zinc-300">|</span>
              <button
                type="button"
                onClick={() => setLane("services")}
                className={
                  lane === "services" ? "text-neutral-950" : "text-zinc-400"
                }
              >
                SERVICES
              </button>
            </div>
          </div>

          <div className="overflow-hidden py-5 sm:py-6">
            <div className="footer-marquee-track flex w-max">
              {[0, 1].map((copy) => (
                <p
                  key={copy}
                  className="pr-8 text-[28px] font-medium tracking-tight whitespace-nowrap text-[#dedede] sm:text-[34px]"
                >
                  {marqueeItems.join("   ·   ")}
                  <span aria-hidden>   ·   </span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 items-center gap-8 px-6 py-6 sm:px-8 lg:min-h-[210px] lg:flex-[0.85] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10 lg:px-10 lg:py-5">
        <div className="relative h-full min-h-[140px] overflow-hidden">
          <Image
            src="/footer-landscape.jpg"
            alt="Landscape"
            fill
            sizes="(min-width: 1024px) 30vw, 100vw"
            className="object-cover grayscale"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-7">
          <div>
            <p className={labelClass}>Head office</p>
            <p className="mt-2 text-[13px] leading-snug">
              2A International Square,
              <br />
              Tullamarine VIC 3043, Australia.
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=2A+International+Square+Tullamarine+VIC+3043"
              className="mt-2 inline-flex items-center gap-1.5 text-[12px] underline decoration-black/40 underline-offset-2"
            >
              <span aria-hidden>→</span>
              Direction on Google
            </a>
          </div>
          <div className="flex flex-col gap-5">
            <div>
              <p className={labelClass}>Email</p>
              <a
                href="mailto:contact@unitedcarriers.com"
                className="mt-2 block text-[13px]"
              >
                contact@unitedcarriers.com
              </a>
            </div>
            <div>
              <p className={labelClass}>Hotline</p>
              <a href="tel:1300000082" className="mt-2 block text-[13px]">
                1300 000 082
              </a>
            </div>
          </div>
          <div>
            <p className={labelClass}>Operating across</p>
            <p className="mt-2 text-[13px]">
              Australia / New Zealand / Hong Kong / China
            </p>
          </div>
          <div>
            <p className={labelClass}>Office hours</p>
            <p className="mt-2 text-[13px]">Monday - Friday / 8:30AM - 5PM</p>
          </div>
        </div>

        <div className="relative h-full min-h-[150px]">
          <WorldMap />
        </div>
      </section>

      <section className="flex flex-col lg:min-h-0 lg:flex-[0.95]">
        <div className="flex flex-col gap-2 border-t border-black/10 px-6 py-2.5 text-[9px] tracking-[0.08em] text-neutral-800 uppercase sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <p className="shrink-0">
            © {new Date().getFullYear()} United Carriers APAC Pty Ltd. Crafted
            by <span className="font-semibold text-neutral-950">Bearplus</span>
          </p>
          <nav aria-label="Legal" className="min-w-0">
            <ul className="flex flex-wrap gap-x-3 gap-y-1">
              {legalLinks.map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="shrink-0 sm:text-right">
            All prices in AUD, inclusive of GST. Powered by Stripe.
          </p>
        </div>
        <div className="flex items-end overflow-hidden px-[1.5vw] pt-4 pb-[2vh] lg:min-h-0 lg:flex-1 lg:pt-0">
          <svg
            viewBox="0 0 1400 168"
            preserveAspectRatio="xMidYMax meet"
            className="h-auto max-h-full w-full"
            role="img"
            aria-label="United Carriers"
          >
            <defs>
              <pattern
                id="footer-word-dots"
                width="4"
                height="4"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1.05" cy="1.05" r="0.9" fill="#c4c4c4" />
              </pattern>
              <mask id="footer-word-mask">
                <text
                  x="12"
                  y="138"
                  fill="white"
                  fontSize="142"
                  fontWeight="650"
                  letterSpacing="-2"
                  textLength="1376"
                  lengthAdjust="spacingAndGlyphs"
                  fontFamily="var(--font-geist-sans), Arial, sans-serif"
                >
                  UNITED CARRIERS
                </text>
              </mask>
            </defs>
            <rect
              width="1400"
              height="168"
              fill="url(#footer-word-dots)"
              mask="url(#footer-word-mask)"
            />
          </svg>
        </div>
      </section>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full border border-black/15 text-neutral-950 transition-colors hover:bg-black/5"
    >
      {children}
    </a>
  );
}

function CardBadge({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-flex h-[18px] min-w-[28px] items-center justify-center rounded-[3px] border border-black/15 bg-white px-1 text-[8px] leading-none font-semibold tracking-wide text-zinc-800 ${className}`}
    >
      {children}
    </span>
  );
}

function MastercardBadge() {
  return (
    <span
      role="img"
      aria-label="Mastercard"
      className="inline-flex h-[18px] w-[28px] items-center justify-center rounded-[3px] border border-black/15 bg-white"
    >
      <svg viewBox="0 0 28 16" className="h-3 w-5" aria-hidden>
        <circle cx="11" cy="8" r="5" fill="#eb001b" />
        <circle cx="17" cy="8" r="5" fill="#f79e1b" />
        <path
          d="M14 4.2a5 5 0 0 1 0 7.6 5 5 0 0 1 0-7.6z"
          fill="#ff5f00"
        />
      </svg>
    </span>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden fill="currentColor">
      <path d="M4.7 3.3A1.8 1.8 0 1 0 4.7 7a1.8 1.8 0 0 0 0-3.7zM3.2 8.6h3v12.1h-3V8.6zm5.2 0h2.9v1.7h.1c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7v7.3h-3v-6.5c0-1.5 0-3.5-2.1-3.5s-2.5 1.7-2.5 3.4v6.6h-3V8.6z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden fill="currentColor">
      <path d="M14.2 8.5V6.9c0-.7.5-1 1.2-1h1.4V3.2h-2.3c-2.5 0-3.9 1.5-3.9 3.9v1.4H8.6V11h2v9.8h3.6V11h2.3l.4-2.5h-2.7z" />
    </svg>
  );
}

function WorldMap() {
  return (
    <svg viewBox="0 0 640 320" className="h-full w-full" aria-hidden>
      <defs>
        <pattern
          id="footer-map-dots"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.1" cy="1.1" r="0.85" fill="#d0d0d0" />
        </pattern>
        <mask id="footer-world">
          <g fill="white">
            <path d="M48 78c28-34 78-38 112-18 18 10 28 8 36 22 10 18 2 34-8 48-14 20-18 36-34 48-22 16-48 8-62-12-16-22-22-28-40-48-8-10-12-28-4-40z" />
            <path d="M118 168c22-6 36 10 40 28 6 28 2 58-8 84-8 22-24 48-42 42-16-6-18-28-16-48 2-22 4-36 2-62-2-16 8-38 24-44z" />
            <path d="M292 62c22-16 52-14 68 2 8 8 6 18-2 28-12 14-28 16-46 10-16-6-28-18-28-30 0-6 2-8 8-10z" />
            <path d="M300 108c28-14 62-6 74 22 10 24 14 52 8 86-6 36-22 70-46 78-20 6-36-10-40-32-6-28-8-48-10-78-2-22 2-62 14-76z" />
            <path d="M372 48c48-22 120-18 176 8 42 20 78 28 92 52 8 16-8 28-36 32-40 6-78-4-112-8-36-4-70 2-96-8-22-8-40-28-42-48-2-12 4-22 18-28z" />
            <path d="M548 196c32-10 62 2 70 18 8 18-4 32-24 38-22 6-48 2-58-12-8-12-6-36 12-44z" />
            <path d="M78 36c16-10 34-6 40 6 4 10-6 20-20 22-14 2-28-8-30-18-2-6 2-8 10-10z" />
          </g>
        </mask>
      </defs>
      <rect
        width="640"
        height="320"
        fill="url(#footer-map-dots)"
        mask="url(#footer-world)"
      />
      {[
        [150, 110],
        [168, 250],
        [330, 78],
        [348, 168],
        [470, 92],
        [520, 118],
        [560, 150],
        [590, 214],
        [430, 200],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.2" fill="#2f6bff" />
      ))}
    </svg>
  );
}
