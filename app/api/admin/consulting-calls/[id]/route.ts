import { NextResponse } from "next/server";
import { isAdminSession } from "@/backend/auth";
import { deleteConsultingCall } from "@/backend/consulting-calls-store";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const removed = await deleteConsultingCall(id);
  if (!removed) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
