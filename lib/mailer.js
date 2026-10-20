import "server-only";

/**
 * Delivers a form submission to the Nebula Webtech inbox.
 *
 * With RESEND_API_KEY set, mail goes out through Resend's HTTP API (no SDK needed).
 * Without it, development logs the submission to the terminal; production refuses,
 * so a visitor is never told "sent" when nothing was delivered.
 */
export async function deliver({ to, subject, text, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`\n[forms] ${subject} → ${to}\n${text}\n`);
      return { id: `dev-${Date.now()}` };
    }
    throw new Error("RESEND_API_KEY is not set");
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.FORMS_FROM ?? "Farasha POS Solutions <forms@farashapos.com>",
      to: [to],
      reply_to: replyTo,
      subject,
      text,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  return res.json();
}

/** Very small in-memory rate limit: 5 submissions per IP per minute, per server instance. */
const hits = new Map();
export function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}
