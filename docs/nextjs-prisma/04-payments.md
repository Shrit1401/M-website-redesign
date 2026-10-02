# 4. Payments with Stripe (optional)

Without this step, `/make-a-payment` saves a `PaymentRequest` and the team emails a payment link manually. With it, the customer is sent straight to Stripe Checkout. Card details never touch this site.

```
/make-a-payment form
   └─ POST /api/payments
        ├─ PaymentRequest (PENDING) saved
        ├─ Stripe Checkout Session created  → status CHECKOUT
        └─ { ok, id, checkoutUrl }  → browser redirects to Stripe
                                         │
Stripe ── checkout.session.completed ──► POST /api/stripe/webhook → status PAID
```

The frontend already supports this. `PaymentForm` redirects whenever the response includes `checkoutUrl`.

## Setup

```bash
npm install stripe
```

`.env`:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # from `stripe listen` locally, or the dashboard in production
SITE_URL=http://localhost:3000    # https://nebulawebtech.com in production
```

## `src/lib/stripe.ts`

```ts
import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
```

`stripe` is `null` when the key isn't set. The payments route then falls back to "we'll email you a link", so local development works without Stripe.

## Update `src/app/api/payments/route.ts`

Replace the `// ── Stripe goes here ──` line with:

```ts
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: body.email!.trim(),
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: body.amountCents!,
              product_data: { name: `Nebula Webtech invoice ${body.invoiceNumber!.trim().toUpperCase()}` },
            },
          },
        ],
        metadata: { paymentRequestId: payment.id },
        success_url: `${process.env.SITE_URL}/make-a-payment?status=success`,
        cancel_url: `${process.env.SITE_URL}/make-a-payment?status=canceled`,
      });

      await prisma.paymentRequest.update({
        where: { id: payment.id },
        data: { status: "CHECKOUT", stripeSessionId: session.id },
      });

      return created(payment.id, { checkoutUrl: session.url ?? undefined });
    }

    return created(payment.id);
```

Add `import { stripe } from "@/lib/stripe";` at the top.

## `src/app/api/stripe/webhook/route.ts`

Stripe signs every webhook. Verify the signature against the **raw** body, which means `request.text()`, not `request.json()`.

```ts
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!stripe || !signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Not configured", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.expired") {
    const session = event.data.object;
    const paid = event.type === "checkout.session.completed" && session.payment_status === "paid";
    // updateMany: no error if the row is missing; safe when Stripe retries the event.
    await prisma.paymentRequest.updateMany({
      where: { stripeSessionId: session.id },
      data: paid ? { status: "PAID", paidAt: new Date() } : { status: "CANCELED" },
    });
  }

  return Response.json({ received: true });
}
```

Test locally with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook   # prints whsec_... → STRIPE_WEBHOOK_SECRET
```

Pay with card `4242 4242 4242 4242`, any future date, any CVC. The row in `PaymentRequest` should move from `CHECKOUT` to `PAID`.

## Small frontend follow-up

Stripe sends customers back to `/make-a-payment?status=success` or `?status=canceled`. The page doesn't read that parameter yet. Add a small client component, wrapped in `<Suspense>` because it uses `useSearchParams`, that shows "Payment received — thank you" or "Payment canceled" above the form.

## Trusting the amount

The customer types the amount, and the backend charges what they typed. That's fine for paying a known invoice, because the team reconciles each `PaymentRequest` against its invoice. To stop wrong amounts entirely, store invoices in Postgres (an `Invoice` model with `number @unique` and `amountCents`). Then have the route look up `invoiceNumber` and charge the stored amount, ignoring `amountCents` from the browser.
