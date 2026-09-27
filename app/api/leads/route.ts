import { NextResponse } from "next/server";
import { createLead } from "@/backend/leads-store";
import type { LeadSource } from "@/backend/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      source?: LeadSource;
    };
    const lead = await createLead(body.email ?? "", body.source as LeadSource);
    return NextResponse.json({ lead: { id: lead.id } }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save your email.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
