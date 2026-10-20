import { CURRENT_SYSTEMS, DEVICES, HARDWARE, PRODUCTS, TIMELINES, deviceTotals, labelOf, validateQuote } from "@/lib/forms";
import { deliver, rateLimited } from "@/lib/mailer";
import { SITE } from "@/lib/content";

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (rateLimited(ip)) return Response.json({ ok: false, error: "Too many attempts." }, { status: 429 });

  const input = await request.json().catch(() => null);
  if (!input || typeof input !== "object") return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  // Honeypot filled: pretend it worked so bots learn nothing.
  if (input.website) return Response.json({ ok: true, id: "ok" });

  const fields = validateQuote(input);
  if (Object.keys(fields).length) {
    return Response.json({ ok: false, error: "Please check the highlighted fields.", fields }, { status: 422 });
  }

  const { perLocation, total } = deviceTotals(input);
  const text = [
    `Name: ${input.name}`,
    `Business: ${input.business}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "—"}`,
    `Role: ${input.role || "—"}`,
    "",
    `Locations: ${input.locations}${input.city ? ` (${input.city})` : ""}`,
    "Devices per location:",
    ...DEVICES.map((d) => `  ${d.label}: ${input.devices[d.key]}`),
    `  → ${perLocation} per location, ${total} in total`,
    "",
    `Products: ${input.products.map((p) => labelOf(PRODUCTS, p)).join(", ")}`,
    `Hardware: ${labelOf(HARDWARE, input.hardware)}`,
    `Current system: ${labelOf(CURRENT_SYSTEMS, input.currentSystem)}`,
    `Timeline: ${labelOf(TIMELINES, input.timeline)}`,
    `Interested in the 90-day pilot: ${input.pilot ? "Yes" : "No"}`,
    "",
    input.message ? `Notes:\n${input.message}` : "Notes: —",
  ].join("\n");

  try {
    const sent = await deliver({
      to: process.env.QUOTES_TO || SITE.quotesEmail,
      replyTo: input.email,
      subject: `Quote request — ${input.business} (${input.locations} location${input.locations > 1 ? "s" : ""}, ${total} devices)`,
      text,
    });
    return Response.json({ ok: true, id: sent.id ?? "sent" });
  } catch (err) {
    console.error("[forms] quote delivery failed", err);
    return Response.json(
      { ok: false, error: `We couldn’t send that right now. Please email ${SITE.quotesEmail} instead.` },
      { status: 503 },
    );
  }
}
