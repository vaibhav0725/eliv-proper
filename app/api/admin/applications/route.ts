import { NextResponse } from "next/server";
import { listApplications } from "@/backend/applications-store";
import { isAdminSession } from "@/backend/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const applications = await listApplications();
  return NextResponse.json({ applications });
}
