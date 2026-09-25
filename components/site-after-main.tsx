"use client";

import { usePathname } from "next/navigation";
import { FaqSection } from "@/components/faq-section";
import { IndustryMoving } from "@/components/industry-moving";
// import { MoveSmarter } from "@/components/move-smarter";

export function SiteAfterMain() {
  const pathname = usePathname();
  const isContact = pathname === "/contact" || pathname.startsWith("/contact/");
  const isIndustries =
    pathname === "/industries" || pathname.startsWith("/industries/");
  const isCareers = pathname === "/careers" || pathname.startsWith("/careers/");
  const isHome = pathname === "/";

  if (isIndustries || isCareers) return null;

  return (
    <>
      {isContact ? null : <IndustryMoving />}
      {isHome ? null : <FaqSection />}
      {/* {isContact ? null : <MoveSmarter />} */}
    </>
  );
}
