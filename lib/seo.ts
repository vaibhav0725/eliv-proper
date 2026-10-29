import type { Metadata } from "next";
import { faqs } from "@/lib/faqs";

const DEFAULT_SITE_URL = "https://www.elivlogistics.com";

function originFrom(value: string) {
  const url = new URL(value);
  return url.origin;
}

export const siteUrl = originFrom(
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL,
);

export const legalName = "E-Liv Solutions LLC";

export const siteName = "Eliv Logistics";

export const siteDescription =
  "Eliv Logistics moves freight across Australia, New Zealand, Hong Kong, and China. Air, ocean, road, project cargo, customs brokerage, and warehousing stay with one team from pickup to delivery.";

export const defaultTitle =
  "Eliv Logistics — Freight, Customs and Transport Across APAC";

export const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Eliv Logistics — freight forwarding, land transport, and customs brokerage across APAC",
} as const;

export const contact = {
  email: "info@elivlogistics.com",
  telephone: "+1-646-249-8054",
  telephoneDisplay: "+1 (646) 249-8054",
  telephoneHref: "tel:+16462498054",
} as const;

export const headquarters = {
  id: "marlton",
  name: "Eliv Logistics",
  label: "Office",
  streetAddress: "Five Greentree Centre, STE. 104",
  addressLocality: "Marlton",
  addressRegion: "NJ",
  postalCode: "08053",
  addressCountry: "US",
  countryName: "USA",
  singleLine: "Five Greentree Centre, STE. 104, Marlton, NJ 08053, USA",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

type ChangeFrequency = "weekly" | "monthly" | "yearly";

export const publicRoutes: {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  // { path: "/industries", changeFrequency: "monthly", priority: 0.8 },
  // { path: "/careers", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.9 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

const services = [
  "Air freight",
  "Ocean freight",
  "Customs brokerage",
  "Warehousing and 3PL",
  "Project cargo",
  "Domestic and interstate transport",
];

const offices = [headquarters];

function postalAddress(office: (typeof offices)[number]) {
  return {
    "@type": "PostalAddress",
    streetAddress: office.streetAddress,
    addressLocality: office.addressLocality,
    addressRegion: office.addressRegion,
    ...(office.postalCode ? { postalCode: office.postalCode } : {}),
    addressCountry: office.addressCountry,
  };
}

export function organizationGraph() {
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteName,
        legalName,
        alternateName: ["ELIV Logistics", "E-Liv Logistics", legalName],
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl("/logo.png"),
        },
        image: absoluteUrl("/opengraph-image"),
        description: siteDescription,
        email: contact.email,
        telephone: contact.telephone,
        address: postalAddress(headquarters),
        areaServed: ["Australia", "New Zealand", "Hong Kong", "China"].map(
          (name) => ({
            "@type": "Country",
            name,
          }),
        ),
        knowsAbout: services,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: contact.telephone,
          email: contact.email,
          contactType: "customer service",
          areaServed: ["Australia", "New Zealand", "Hong Kong", "China"],
          availableLanguage: ["English"],
          hoursAvailable: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "08:30",
            closes: "17:00",
          },
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: siteName,
        description: siteDescription,
        publisher: { "@id": organizationId },
        inLanguage: "en-AU",
      },
      ...offices.map((office) => ({
        "@type": "ProfessionalService",
        "@id": `${siteUrl}/#${office.id}`,
        name: office.name,
        description: office.label,
        url: absoluteUrl("/contact"),
        image: absoluteUrl("/opengraph-image"),
        telephone: contact.telephone,
        email: contact.email,
        parentOrganization: { "@id": organizationId },
        address: postalAddress(office),
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:30",
          closes: "17:00",
        },
        areaServed: office.addressCountry,
      })),
    ],
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function servicesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Eliv Logistics services",
    itemListElement: services.map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: ["Australia", "New Zealand", "Hong Kong", "China"],
        url: absoluteUrl("/services"),
      },
    })),
  };
}

export function pageMetadata({
  title,
  description,
  path,
  absolute = false,
}: {
  title: string;
  description: string;
  path: string;
  absolute?: boolean;
}): Metadata {
  const socialTitle = absolute ? title : `${title} — ${siteName}`;

  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_AU",
      url: path,
      siteName,
      title: socialTitle,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage.url],
    },
  };
}

function envTag(name: string) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function rootMetadata(): Metadata {
  const google = envTag("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION");
  const bing = envTag("NEXT_PUBLIC_BING_SITE_VERIFICATION");
  const facebookDomain = envTag("NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION");
  const facebookAppId = envTag("NEXT_PUBLIC_FACEBOOK_APP_ID");

  const other: Record<string, string> = {};
  if (bing) other["msvalidate.01"] = bing;
  if (facebookDomain) other["facebook-domain-verification"] = facebookDomain;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s — ${siteName}`,
    },
    description: siteDescription,
    applicationName: siteName,
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    category: "logistics",
    keywords: [
      "Eliv Logistics",
      "freight forwarding",
      "customs brokerage",
      "air freight",
      "ocean freight",
      "project cargo",
      "warehousing",
      "Australia freight",
      "New Zealand freight",
      "Hong Kong freight",
      "China freight",
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_AU",
      url: siteUrl,
      siteName,
      title: defaultTitle,
      description: siteDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: siteDescription,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: ["/favicon.ico"],
    },
    ...(google || bing || facebookDomain
      ? {
          verification: {
            ...(google ? { google } : {}),
            ...(Object.keys(other).length ? { other } : {}),
          },
        }
      : {}),
    ...(facebookAppId ? { facebook: { appId: facebookAppId } } : {}),
  };
}
