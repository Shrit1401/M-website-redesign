/**
 * The data contract between this frontend and the (not yet built) backend.
 *
 * Plain TypeScript with no browser or server dependencies, so the backend's Route Handlers can
 * import the same types and validators — see docs/nextjs-prisma/03-api-routes.md.
 */

export const SERVICE_INTERESTS = [
  { value: "WEB_DESIGN_DEVELOPMENT", label: "Web design & development" },
  { value: "WEB_MAINTENANCE", label: "Web maintenance" },
  { value: "DIGITAL_MARKETING", label: "Digital marketing (SEO, SEM, SMO, SMM)" },
  { value: "OTHER", label: "Something else / not sure yet" },
] as const;

export const BUDGETS = [
  { value: "UNDER_2K", label: "Under $2,000" },
  { value: "FROM_2K_TO_5K", label: "$2,000 – $5,000" },
  { value: "FROM_5K_TO_10K", label: "$5,000 – $10,000" },
  { value: "OVER_10K", label: "$10,000+" },
  { value: "NOT_SURE", label: "Not sure yet" },
] as const;

export type ServiceInterest = (typeof SERVICE_INTERESTS)[number]["value"];
export type Budget = (typeof BUDGETS)[number]["value"];

/** POST /api/contact */
export type ContactInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: ServiceInterest;
  budget?: Budget;
  message: string;
  /** Page the visitor submitted from, e.g. "/services/strategic-digital-marketing-solutions". */
  source?: string;
  /** Honeypot. Always empty for real people; the backend should silently drop submissions that fill it. */
  website?: string;
};

/** POST /api/newsletter */
export type NewsletterInput = {
  email: string;
  website?: string;
};

/** POST /api/payments */
export type PaymentInput = {
  invoiceNumber: string;
  name: string;
  email: string;
  /** Integer cents, e.g. $1,250.50 → 125050. Never send floats for money. */
  amountCents: number;
  note?: string;
  website?: string;
};

export type ApiSuccess = {
  ok: true;
  id: string;
  /** /api/payments only: when present, the frontend redirects here (e.g. a Stripe Checkout URL). */
  checkoutUrl?: string;
};

export type ApiFailure = {
  ok: false;
  error: string;
  /** Field-level messages keyed by input name, shown under each field. */
  fields?: Record<string, string>;
};

export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const trim = (v: unknown) => (typeof v === "string" ? v.trim() : "");

function check(errors: FieldErrors, field: string, ok: boolean, message: string) {
  if (!ok && !errors[field]) errors[field] = message;
}

export function validateContact(input: Partial<ContactInput>): FieldErrors {
  const e: FieldErrors = {};
  const name = trim(input.name);
  const email = trim(input.email);
  const message = trim(input.message);
  const phone = trim(input.phone);
  check(e, "name", name.length >= 2, "Please enter your name.");
  check(e, "name", name.length <= 120, "Name is too long.");
  check(e, "email", EMAIL_RE.test(email) && email.length <= 254, "Please enter a valid email address.");
  check(e, "phone", !phone || /^[+()\-.\s\d]{7,20}$/.test(phone), "Please enter a valid phone number.");
  check(e, "company", trim(input.company).length <= 160, "Company name is too long.");
  check(
    e,
    "service",
    SERVICE_INTERESTS.some((s) => s.value === input.service),
    "Please choose what you need help with.",
  );
  check(e, "budget", !input.budget || BUDGETS.some((b) => b.value === input.budget), "Please choose a budget.");
  check(e, "message", message.length >= 10, "Tell us a little about your project (at least 10 characters).");
  check(e, "message", message.length <= 5000, "Please keep your message under 5,000 characters.");
  return e;
}

export function validateNewsletter(input: Partial<NewsletterInput>): FieldErrors {
  const e: FieldErrors = {};
  check(e, "email", EMAIL_RE.test(trim(input.email)), "Please enter a valid email address.");
  return e;
}

export function validatePayment(input: Partial<PaymentInput>): FieldErrors {
  const e: FieldErrors = {};
  const invoice = trim(input.invoiceNumber);
  check(e, "invoiceNumber", /^[A-Za-z0-9-]{2,40}$/.test(invoice), "Enter the invoice number from your invoice.");
  check(e, "name", trim(input.name).length >= 2, "Please enter your name.");
  check(e, "email", EMAIL_RE.test(trim(input.email)), "Please enter a valid email address.");
  check(
    e,
    "amountCents",
    Number.isInteger(input.amountCents) && (input.amountCents ?? 0) >= 100 && (input.amountCents ?? 0) <= 10_000_000,
    "Enter an amount between $1 and $100,000.",
  );
  check(e, "note", trim(input.note).length <= 1000, "Please keep the note under 1,000 characters.");
  return e;
}

/** "$1,250.50" / "1250.5" → 125050. Returns NaN for anything that isn't a valid dollar amount. */
export function dollarsToCents(value: string): number {
  const clean = value.replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(clean)) return NaN;
  const [whole, frac = ""] = clean.split(".");
  return Number(whole) * 100 + Number(frac.padEnd(2, "0"));
}
