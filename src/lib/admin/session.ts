import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Admin session token: `<expiresAtMs>.<hmac>` in an httpOnly cookie.
 *
 * Single shared password (ADMIN_PASSWORD), no user accounts. The HMAC key is ADMIN_SESSION_SECRET,
 * falling back to the password itself, so changing the password signs everyone out.
 * Imported by proxy.ts (optimistic redirect) and by auth.ts (the real check in every page and action).
 */

export const SESSION_COOKIE = "nebula_admin";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

/** Compares fixed-length digests so neither the length nor the content leaks through timing. */
export function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function createToken(now = Date.now()) {
  const expires = String(now + SESSION_TTL_MS);
  return `${expires}.${sign(expires)}`;
}

export function verifyToken(token: string | undefined, now = Date.now()) {
  if (!token || !adminConfigured()) return false;
  const [expires, mac] = token.split(".");
  if (!expires || !mac || !/^\d+$/.test(expires)) return false;
  return Number(expires) > now && safeEqual(mac, sign(expires));
}
