import { TOPICS, labelOf, validateContact } from "@/lib/forms";
import { deliver, rateLimited } from "@/lib/mailer";
import { SITE } from "@/lib/content";

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (rateLimited(ip)) return Response.json({ ok: false, error: "Too many attempts." }, { status: 429 });

  const input = await request.json().catch(() => null);
  if (!input || typeof input !== "object") return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  if (input.website) return Response.json({ ok: true, id: "ok" });

  const fields = validateContact(input);
  if (Object.keys(fields).length) {
    return Response.json({ ok: false, error: "Please check the highlighted fields.", fields }, { status: 422 });
  }

  const text = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "—"}`,
    `Business: ${input.business || "—"}`,
    `Topic: ${labelOf(TOPICS, input.topic)}`,
    "",
    input.message,
  ].join("\n");

  try {
    const sent = await deliver({
      to: process.env.CONTACT_TO || SITE.contactEmail,
      replyTo: input.email,
      subject: `Contact — ${labelOf(TOPICS, input.topic)} — ${input.name}`,
      text,
    });
    return Response.json({ ok: true, id: sent.id ?? "sent" });
  } catch (err) {
    console.error("[forms] contact delivery failed", err);
    return Response.json(
      { ok: false, error: `We couldn’t send that right now. Please email ${SITE.contactEmail} instead.` },
      { status: 503 },
    );
  }
}
