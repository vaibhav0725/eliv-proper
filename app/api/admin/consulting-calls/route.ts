import { NextResponse } from "next/server";
import { isAdminSession } from "@/backend/auth";
import { listConsultingCalls } from "@/backend/consulting-calls-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const calls = await listConsultingCalls();
  return NextResponse.json({ calls });
}
