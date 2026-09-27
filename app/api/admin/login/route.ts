import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionToken,
  credentialsMatch,
  sessionCookieOptions,
} from "@/backend/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!credentialsMatch(body.email ?? "", body.password ?? "")) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(), sessionCookieOptions());
  return response;
}
