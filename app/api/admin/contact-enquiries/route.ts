import { NextResponse } from "next/server";
import { isAdminSession } from "@/backend/auth";
import { listContactEnquiries } from "@/backend/contact-enquiries-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const enquiries = await listContactEnquiries();
  return NextResponse.json({ enquiries });
}
