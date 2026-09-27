import { NextResponse } from "next/server";
import { isAdminSession } from "@/backend/auth";
import { listLeads } from "@/backend/leads-store";
import type { LeadSource } from "@/backend/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source") as LeadSource | null;
  const leads = await listLeads(
    source === "newsletter" || source === "book-a-call" ? source : undefined,
  );
  return NextResponse.json({ leads });
}
