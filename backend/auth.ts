import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_EMAIL = "eliv@admin.com";
export const ADMIN_PASSWORD = "eliv123";
export const ADMIN_COOKIE = "eliv_admin";

const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const SECRET =
  process.env.ADMIN_SESSION_SECRET ?? "eliv-admin-local-session-secret";

export function credentialsMatch(email: string, password: string) {
  return (
    email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD
  );
}

export function createSessionToken() {
  const exp = String(Date.now() + SESSION_MS);
  const sig = createHmac("sha256", SECRET).update(exp).digest("hex");
  return `${exp}.${sig}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;

  const expected = createHmac("sha256", SECRET).update(exp).digest("hex");
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  if (!timingSafeEqual(left, right)) return false;

  return Number(exp) > Date.now();
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MS / 1000,
  };
}

export async function isAdminSession() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}
