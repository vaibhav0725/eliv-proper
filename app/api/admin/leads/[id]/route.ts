import { NextResponse } from "next/server";
import { isAdminSession } from "@/backend/auth";
import { deleteLead } from "@/backend/leads-store";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const removed = await deleteLead(id);
  if (!removed) {
    return NextResponse.json({ error: "Response not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
