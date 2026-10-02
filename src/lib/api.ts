import type { ApiFailure, ApiSuccess, ContactInput, FieldErrors, NewsletterInput, PaymentInput } from "./contracts";
import { SITE } from "./site";

/**
 * Browser-side client for the backend. The frontend only ever talks to these three endpoints;
 * the backend that answers them is described in docs/nextjs-prisma/.
 *
 * NEXT_PUBLIC_API_URL is empty by default, meaning same-origin Route Handlers (`/api/...`).
 * Set it to point at a separately hosted API instead.
 */
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

export const ENDPOINTS = {
  contact: "/api/contact",
  newsletter: "/api/newsletter",
  payments: "/api/payments",
} as const;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly fields: FieldErrors = {},
    readonly status = 0,
  ) {
    super(message);
  }
}

const FALLBACK = `We couldn't send that right now. Please try again, or call us at ${SITE.phone}.`;

async function post<T>(path: string, body: T): Promise<ApiSuccess> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(FALLBACK);
  }

  const data = (await res.json().catch(() => null)) as ApiSuccess | ApiFailure | null;
  if (res.ok && data?.ok) return data;

  if (res.status === 404 && process.env.NODE_ENV === "development") {
    // Most likely the backend hasn't been set up yet.
    throw new ApiError(`No backend at ${path} yet — follow docs/nextjs-prisma/ to connect Prisma + Postgres.`, {}, 404);
  }
  if (res.status === 429) throw new ApiError("Too many attempts. Please wait a minute and try again.", {}, 429);

  const failure = data && !data.ok ? data : null;
  throw new ApiError(failure?.error ?? FALLBACK, failure?.fields ?? {}, res.status);
}

export const api = {
  contact: (input: ContactInput) => post(ENDPOINTS.contact, input),
  newsletter: (input: NewsletterInput) => post(ENDPOINTS.newsletter, input),
  payment: (input: PaymentInput) => post(ENDPOINTS.payments, input),
};
