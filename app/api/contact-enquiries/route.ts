import { NextResponse } from "next/server";
import { createContactEnquiry } from "@/backend/contact-enquiries-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      reason?: string;
      fullName?: string;
      company?: string;
      email?: string;
      phone?: string;
      message?: string;
    };
    const enquiry = await createContactEnquiry({
      reason: body.reason ?? "",
      fullName: body.fullName ?? "",
      company: body.company ?? "",
      email: body.email ?? "",
      phone: body.phone ?? "",
      message: body.message ?? "",
    });
    return NextResponse.json({ enquiry: { id: enquiry.id } }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not send your enquiry.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
