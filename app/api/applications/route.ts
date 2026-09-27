import { NextResponse } from "next/server";
import { createApplication } from "@/backend/applications-store";
import { listJobs } from "@/backend/jobs-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const jobId = String(form.get("jobId") ?? "");
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const message = String(form.get("message") ?? "");
    const resume = form.get("resume");

    if (!(resume instanceof File)) {
      return NextResponse.json(
        { error: "Upload a PDF resume." },
        { status: 400 },
      );
    }

    const jobs = await listJobs();
    const job = jobs.find((item) => item.id === jobId);
    if (!job) {
      return NextResponse.json(
        { error: "That role is no longer listed." },
        { status: 404 },
      );
    }

    const buffer = Buffer.from(await resume.arrayBuffer());
    const application = await createApplication({
      jobId: job.id,
      jobHeading: job.heading,
      name,
      email,
      phone,
      message,
      resume: {
        originalName: resume.name,
        buffer,
      },
    });

    return NextResponse.json({
      application: {
        id: application.id,
        submittedAt: application.submittedAt,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not send application.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
