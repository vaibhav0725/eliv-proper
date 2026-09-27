import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminSession } from "@/backend/auth";
import { createJob, listJobs } from "@/backend/jobs-store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const jobs = await listJobs();
  return NextResponse.json({ jobs });
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      heading?: string;
      details?: string;
      location?: string;
      type?: string;
      showOnTop?: boolean;
    };
    const job = await createJob({
      heading: body.heading ?? "",
      details: body.details ?? "",
      location: body.location ?? "",
      type: body.type ?? "",
      showOnTop: Boolean(body.showOnTop),
    });
    revalidatePath("/careers");
    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create job.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
