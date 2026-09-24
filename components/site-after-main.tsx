"use client";

import { usePathname } from "next/navigation";
import { FaqSection } from "@/components/faq-section";
import { IndustryMoving } from "@/components/industry-moving";
import { MoveSmarter } from "@/components/move-smarter";

export function SiteAfterMain() {
  const pathname = usePathname();
  const isContact = pathname === "/contact" || pathname.startsWith("/contact/");

  return (
    <>
      {isContact ? null : <IndustryMoving />}
      <FaqSection />
      {isContact ? null : <MoveSmarter />}
    </>
  );
}
