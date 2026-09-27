import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminSession } from "@/backend/auth";
import { deleteJob, updateJob } from "@/backend/jobs-store";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = (await request.json()) as {
      heading?: string;
      details?: string;
      location?: string;
      type?: string;
      showOnTop?: boolean;
    };
    const job = await updateJob(id, {
      heading: body.heading ?? "",
      details: body.details ?? "",
      location: body.location ?? "",
      type: body.type ?? "",
      showOnTop: Boolean(body.showOnTop),
    });
    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }
    revalidatePath("/careers");
    return NextResponse.json({ job });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update job.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const removed = await deleteJob(id);
  if (!removed) {
    return NextResponse.json({ error: "Job not found." }, { status: 404 });
  }
  revalidatePath("/careers");
  return NextResponse.json({ ok: true });
}
