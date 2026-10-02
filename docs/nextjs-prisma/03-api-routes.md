# 3. API routes

The forms already call these three endpoints through `src/lib/api.ts`. Build them as Next.js **Route Handlers** in `src/app/api/`, and the site is connected.

## The contract

Every endpoint takes JSON and returns JSON.

**Success** — status `201`:

```json
{ "ok": true, "id": "cm1x2y3z4000008l4abcd1234" }
```

`/api/payments` may also return `"checkoutUrl": "https://checkout.stripe.com/..."`. The browser then redirects there (see [04-payments.md](04-payments.md)).

**Failure** — status `400`, `429` or `500`:

```json
{
  "ok": false,
  "error": "Please check the highlighted fields.",
  "fields": { "email": "Please enter a valid email address." }
}
```

How the frontend reacts (`src/lib/api.ts` → `src/components/Forms.tsx`):

| Status | Frontend behaviour |
|---|---|
| `201` + `ok: true` | Shows the success state (or redirects to `checkoutUrl`) |
| `400` + `fields` | Shows each message under its field, using the input names below |
| `429` | "Too many attempts. Please wait a minute and try again." |
| `404` in dev | "No backend at /api/... yet" (the routes aren't built yet) |
| anything else | Shows `error`, or falls back to "please call us at (224) 457-0242" |

### Request bodies

Types are in `src/lib/contracts.ts`. `fields` keys must use these exact names.

**`POST /api/contact`** — `ContactInput`

| Field | Type | Rules |
|---|---|---|
| `name` | string | 2–120 chars |
| `email` | string | valid email, ≤ 254 chars |
| `phone` | string? | 7–20 chars of digits, spaces, `+ ( ) - .` |
| `company` | string? | ≤ 160 chars |
| `service` | `ServiceInterest` | one of `WEB_DESIGN_DEVELOPMENT`, `WEB_MAINTENANCE`, `DIGITAL_MARKETING`, `OTHER` |
| `budget` | `Budget`? | one of `UNDER_2K`, `FROM_2K_TO_5K`, `FROM_5K_TO_10K`, `OVER_10K`, `NOT_SURE` |
| `message` | string | 10–5000 chars |
| `source` | string? | page path it was sent from |
| `website` | string? | honeypot — must be empty |

**`POST /api/newsletter`** — `NewsletterInput`: `email`, `website?`

**`POST /api/payments`** — `PaymentInput`

| Field | Type | Rules |
|---|---|---|
| `invoiceNumber` | string | 2–40 chars, letters, digits and `-` |
| `name` | string | ≥ 2 chars |
| `email` | string | valid email |
| `amountCents` | integer | 100 – 10,000,000 ($1 – $100,000) |
| `note` | string? | ≤ 1000 chars |
| `website` | string? | honeypot — must be empty |

## `src/lib/http.ts`

Shared helpers for all three routes.

```ts
import type { ApiFailure, ApiSuccess, FieldErrors } from "@/lib/contracts";

export function created(id: string, extra: Partial<ApiSuccess> = {}) {
  return Response.json({ ok: true, id, ...extra } satisfies ApiSuccess, { status: 201 });
}

export function fail(status: number, error: string, fields?: FieldErrors) {
  return Response.json({ ok: false, error, ...(fields ? { fields } : {}) } satisfies ApiFailure, { status });
}

/** Parses a JSON object body, or returns null for anything else (bad JSON, arrays, too large). */
export async function readJson<T>(request: Request, maxBytes = 20_000): Promise<Partial<T> | null> {
  const text = await request.text();
  if (text.length > maxBytes) return null;
  try {
    const data = JSON.parse(text);
    return data && typeof data === "object" && !Array.isArray(data) ? (data as Partial<T>) : null;
  } catch {
    return null;
  }
}

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Best-effort in-memory rate limit: `limit` requests per `windowMs` per key.
 * Fine for one server. On Vercel each function instance has its own memory, so for
 * strict limits use a shared store (Upstash Redis, or a Postgres table).
 */
const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

export const isBot = (body: { website?: unknown }) => typeof body.website === "string" && body.website.length > 0;

/** Trims a string field; turns empty strings into undefined (→ NULL in Postgres). */
export const clean = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
```

## `src/app/api/contact/route.ts`

```ts
import { validateContact, type ContactInput } from "@/lib/contracts";
import { clean, clientIp, created, fail, isBot, rateLimit, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (!rateLimit(`contact:${ip}`)) return fail(429, "Too many attempts. Please wait a minute and try again.");

  const body = await readJson<ContactInput>(request);
  if (!body) return fail(400, "Invalid request.");
  if (isBot(body)) return created("ok"); // pretend it worked; save nothing

  const fields = validateContact(body);
  if (Object.keys(fields).length) return fail(400, "Please check the highlighted fields.", fields);

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name: body.name!.trim(),
        email: body.email!.trim().toLowerCase(),
        phone: clean(body.phone),
        company: clean(body.company),
        service: body.service!,
        budget: body.budget,
        message: body.message!.trim(),
        source: clean(body.source)?.slice(0, 200),
        ip,
        userAgent: request.headers.get("user-agent")?.slice(0, 300),
      },
      select: { id: true },
    });

    // Optional: notify the team here (see "Getting notified" below).
    return created(inquiry.id);
  } catch (error) {
    console.error("[api/contact]", error);
    return fail(500, "We couldn't save your message. Please try again or call (224) 457-0242.");
  }
}
```

`validateContact` has already checked that `service` and `budget` are valid enum values. That's why `body.service!` is safe to pass to Prisma: the string-literal types in `contracts.ts` match the generated Prisma enum types.

## `src/app/api/newsletter/route.ts`

Subscribing twice isn't an error. It upserts and re-subscribes anyone who had unsubscribed. The response never reveals whether an address was already on the list.

```ts
import { validateNewsletter, type NewsletterInput } from "@/lib/contracts";
import { clientIp, created, fail, isBot, rateLimit, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!rateLimit(`newsletter:${clientIp(request)}`)) {
    return fail(429, "Too many attempts. Please wait a minute and try again.");
  }

  const body = await readJson<NewsletterInput>(request);
  if (!body) return fail(400, "Invalid request.");
  if (isBot(body)) return created("ok");

  const fields = validateNewsletter(body);
  if (Object.keys(fields).length) return fail(400, fields.email, fields);

  try {
    const email = body.email!.trim().toLowerCase();
    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      create: { email, source: request.headers.get("referer")?.slice(0, 200) },
      update: { unsubscribedAt: null },
      select: { id: true },
    });
    return created(subscriber.id);
  } catch (error) {
    console.error("[api/newsletter]", error);
    return fail(500, "We couldn't subscribe you right now. Please try again.");
  }
}
```

## `src/app/api/payments/route.ts`

Without Stripe, this saves the request as `PENDING`. The site then shows "We'll email you a secure payment link", and the team sends one manually. [04-payments.md](04-payments.md) replaces the marked block with Stripe Checkout.

```ts
import { validatePayment, type PaymentInput } from "@/lib/contracts";
import { clean, clientIp, created, fail, isBot, rateLimit, readJson } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!rateLimit(`payments:${clientIp(request)}`)) {
    return fail(429, "Too many attempts. Please wait a minute and try again.");
  }

  const body = await readJson<PaymentInput>(request);
  if (!body) return fail(400, "Invalid request.");
  if (isBot(body)) return created("ok");

  const fields = validatePayment(body);
  if (Object.keys(fields).length) return fail(400, "Please check the highlighted fields.", fields);

  try {
    const payment = await prisma.paymentRequest.create({
      data: {
        invoiceNumber: body.invoiceNumber!.trim().toUpperCase(),
        name: body.name!.trim(),
        email: body.email!.trim().toLowerCase(),
        amountCents: body.amountCents!,
        note: clean(body.note),
      },
      select: { id: true },
    });

    // ── Stripe goes here (04-payments.md) ──
    return created(payment.id);
  } catch (error) {
    console.error("[api/payments]", error);
    return fail(500, "We couldn't start your payment. Please try again or call (224) 457-0242.");
  }
}
```

## Try it

```bash
npm run dev

curl -i localhost:3000/api/contact -H 'content-type: application/json' -d '{
  "name": "Test Person", "email": "test@example.com",
  "service": "WEB_MAINTENANCE", "message": "Testing the contact endpoint."
}'
# → 201 {"ok":true,"id":"..."}

curl -i localhost:3000/api/contact -H 'content-type: application/json' -d '{"email":"nope"}'
# → 400 {"ok":false,"error":"Please check the highlighted fields.","fields":{...}}
```

Then submit the real forms at `/contact-us`, in the footer and at `/make-a-payment`, and check the rows in `npm run db:studio`.

## Getting notified

Saving a lead is only half the job: someone has to see it. Pick one and call it after `prisma.inquiry.create(...)`. Wrap it in `try/catch` so a failed email never fails the request.

- **Email** with [Resend](https://resend.com) or Postmark: `npm install resend`, then send a short email to `info@nebulawebtech.com` containing the inquiry fields.
- **Webhook** to Slack, Zapier or Make: `await fetch(process.env.INQUIRY_WEBHOOK_URL!, { method: "POST", body: JSON.stringify(inquiry) })`.

If you add one, put the new env var (`RESEND_API_KEY` or `INQUIRY_WEBHOOK_URL`) in `.env.example`.

## If the API lives on another domain

Set `NEXT_PUBLIC_API_URL=https://api.example.com` and rebuild the frontend. The API must answer CORS preflight (`OPTIONS`) and send `Access-Control-Allow-Origin: https://nebulawebtech.com`. With same-origin Route Handlers (the default), none of this is needed.
