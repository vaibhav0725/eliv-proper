import { NextResponse } from "next/server";
import {
  getApplication,
  readResumeFile,
} from "@/backend/applications-store";
import { isAdminSession } from "@/backend/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const application = await getApplication(id);
  if (!application) {
    return NextResponse.json(
      { error: "Submission not found." },
      { status: 404 },
    );
  }

  try {
    const file = await readResumeFile(application.resumeStoredName);
    const safeName = application.resumeFileName.replace(/"/g, "");
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${safeName}"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Resume file is missing." },
      { status: 404 },
    );
  }
}
