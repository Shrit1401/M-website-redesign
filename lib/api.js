import { OWNER } from "./content";

/** Browser client for the form endpoints in app/api/. */
export class ApiError extends Error {
  constructor(message, fields = {}, status = 0) {
    super(message);
    this.fields = fields;
    this.status = status;
  }
}

const FALLBACK = `We couldn’t send that right now. Please try again, or call Nebula Webtech at ${OWNER.phone}.`;

async function post(path, body) {
  let res;
  try {
    res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(FALLBACK);
  }
  const data = await res.json().catch(() => null);
  if (res.ok && data?.ok) return data;
  if (res.status === 429) throw new ApiError("Too many attempts. Please wait a minute and try again.", {}, 429);
  throw new ApiError(data?.error ?? FALLBACK, data?.fields ?? {}, res.status);
}

export const api = {
  quote: (input) => post("/api/quote", input),
  contact: (input) => post("/api/contact", input),
};
