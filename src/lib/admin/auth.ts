import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, SESSION_TTL_MS, adminConfigured, createToken, safeEqual, verifyToken } from "./session";

export { adminConfigured };

export async function isAdmin() {
  return verifyToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/**
 * The real access check. Call it at the top of every admin page and every admin Server Action —
 * Server Actions are plain POST endpoints, so the proxy redirect alone doesn't protect them.
 */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function startSession() {
  (await cookies()).set(SESSION_COOKIE, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export const checkPassword = (input: string) => adminConfigured() && safeEqual(input, process.env.ADMIN_PASSWORD!);

/* Best-effort login throttle: 8 attempts per 15 minutes per IP, per server instance. */
const attempts = new Map<string, { count: number; reset: number }>();

export async function loginAllowed() {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.reset < now) {
    attempts.set(ip, { count: 1, reset: now + 15 * 60_000 });
    return true;
  }
  entry.count += 1;
  return entry.count <= 8;
}
