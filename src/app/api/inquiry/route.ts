const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = 5000;

type Body = Record<string, unknown>;

function str(v: unknown) {
  return typeof v === "string" ? v.trim().slice(0, MAX) : "";
}

function validate(body: Body): string | null {
  if (body.kind !== "requirements" && body.kind !== "inquiry") return "Unknown form type.";
  if (!str(body.name)) return "Please enter your name.";
  if (!EMAIL.test(str(body.email))) return "Please enter a valid email address.";
  if (body.kind === "inquiry" && !str(body.message)) return "Please include a message.";
  if (body.kind === "requirements") {
    if (!str(body.company)) return "Please enter your company.";
    if (str(body.description).length < 20) return "Please describe your project in a bit more detail.";
  }
  return null;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success.
  if (str(body.company_url)) return Response.json({ ok: true });

  const error = validate(body);
  if (error) return Response.json({ error }, { status: 422 });

  const submission = {
    ...Object.fromEntries(
      Object.entries(body)
        .filter(([k]) => k !== "company_url")
        .map(([k, v]) => [k, Array.isArray(v) ? v.map(str) : str(v)]),
    ),
    receivedAt: new Date().toISOString(),
  };

  // Forward to Slack/Zapier/Make/CRM webhook when configured; otherwise log on the server.
  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    }).catch(() => null);
    if (!res?.ok) {
      return Response.json({ error: "We couldn't send your message. Please email us directly." }, { status: 502 });
    }
  } else {
    console.info("[inquiry]", JSON.stringify(submission));
  }

  return Response.json({ ok: true });
}
