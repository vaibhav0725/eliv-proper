import { NextResponse } from "next/server";
import { createConsultingCall } from "@/backend/consulting-calls-store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      phone?: string;
      company?: string;
      preferredTime?: string;
      message?: string;
    };
    const call = await createConsultingCall({
      fullName: body.fullName ?? "",
      email: body.email ?? "",
      phone: body.phone ?? "",
      company: body.company ?? "",
      preferredTime: body.preferredTime ?? "",
      message: body.message ?? "",
    });
    return NextResponse.json({ call: { id: call.id } }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not send your request.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
