import { NextResponse } from "next/server";
import { listPublicJobs } from "@/backend/jobs-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const jobs = await listPublicJobs();
  return NextResponse.json({ jobs });
}
