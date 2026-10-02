"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ApiError, api } from "@/lib/api";
import {
  BUDGETS,
  SERVICE_INTERESTS,
  dollarsToCents,
  validateContact,
  validateNewsletter,
  validatePayment,
  type ContactInput,
  type FieldErrors,
  type ServiceInterest,
} from "@/lib/contracts";
import { Icon } from "./Icon";

type Status = "idle" | "sending" | "sent";

/** Shared submit state: client-side validation first, then the API, mapping server field errors back. */
function useSubmit() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [fields, setFields] = useState<FieldErrors>({});

  async function run(errors: FieldErrors, send: () => Promise<unknown>) {
    setError("");
    setFields(errors);
    if (Object.keys(errors).length) {
      // Move focus to the first invalid field so keyboard and screen-reader users land on it.
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return false;
    }
    setStatus("sending");
    try {
      await send();
      setStatus("sent");
      return true;
    } catch (e) {
      const err = e instanceof ApiError ? e : new ApiError("Something went wrong. Please try again.");
      setFields(err.fields);
      setError(err.message);
      setStatus("idle");
      return false;
    }
  }

  const clearField = (name: string) =>
    setFields((f) => {
      if (!f[name]) return f;
      const next = { ...f };
      delete next[name];
      return next;
    });

  return { status, setStatus, error, fields, run, clearField };
}

function Field({
  label,
  name,
  error,
  optional,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block" htmlFor={name}>
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </span>
      {children}
      {error && (
        <span id={`${name}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs text-[#ff9db4]">
          <Icon name="alert" className="size-3.5" /> {error}
        </span>
      )}
    </label>
  );
}

const fieldProps = (name: string, fields: FieldErrors) => ({
  id: name,
  name,
  "aria-invalid": fields[name] ? true : undefined,
  "aria-describedby": fields[name] ? `${name}-error` : undefined,
  className: "field",
});

/** Hidden from people; bots that fill every input reveal themselves. */
function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-start gap-2.5 rounded-2xl border border-[#ff7a9a]/30 bg-[#ff7a9a]/[0.08] px-4 py-3 text-sm text-[#ffc2d0]"
        >
          <Icon name="alert" className="mt-0.5 size-4 shrink-0" /> {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function Success({ title, body, onReset }: { title: string; body: string; onReset?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-12 text-center"
      role="status"
    >
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-violet/15 text-violet shadow-[0_0_40px_rgb(166_123_255/0.4)]">
        <Icon name="check" className="size-7" />
      </span>
      <h3 className="mt-6 text-2xl font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-ink-soft">{body}</p>
      {onReset && (
        <button type="button" onClick={onReset} className="btn btn-outline mt-8">
          Send another message
        </button>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------- contact */

const EMPTY_CONTACT = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "" as ServiceInterest | "",
  budget: "",
  message: "",
  website: "",
};

export function ContactForm({ defaultService }: { defaultService?: ServiceInterest }) {
  const pathname = usePathname();
  const [form, setForm] = useState({ ...EMPTY_CONTACT, service: defaultService ?? "" });
  const { status, setStatus, error, fields, run, clearField } = useSubmit();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    clearField(k);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: ContactInput = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      company: form.company.trim() || undefined,
      service: form.service as ServiceInterest,
      budget: (form.budget || undefined) as ContactInput["budget"],
      message: form.message.trim(),
      source: pathname,
      website: form.website,
    };
    await run(validateContact(payload), () => api.contact(payload));
  }

  if (status === "sent") {
    return (
      <Success
        title="Message received"
        body="Thanks for reaching out. We'll get back to you within one business day (Mon–Fri, 9–5 CST)."
        onReset={() => {
          setForm({ ...EMPTY_CONTACT, service: defaultService ?? "" });
          setStatus("idle");
        }}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5">
      <Honeypot value={form.website} onChange={(v) => setForm((f) => ({ ...f, website: v }))} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={fields.name}>
          <input {...fieldProps("name", fields)} autoComplete="name" value={form.name} onChange={set("name")} placeholder="Jane Cooper" />
        </Field>
        <Field label="Email" name="email" error={fields.email}>
          <input {...fieldProps("email", fields)} type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" />
        </Field>
        <Field label="Phone" name="phone" error={fields.phone} optional>
          <input {...fieldProps("phone", fields)} type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} placeholder="(224) 555-0100" />
        </Field>
        <Field label="Company" name="company" error={fields.company} optional>
          <input {...fieldProps("company", fields)} autoComplete="organization" value={form.company} onChange={set("company")} placeholder="Company name" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="What do you need help with?" name="service" error={fields.service}>
          <select {...fieldProps("service", fields)} value={form.service} onChange={set("service")}>
            <option value="" disabled>
              Choose a service
            </option>
            {SERVICE_INTERESTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget" name="budget" error={fields.budget} optional>
          <select {...fieldProps("budget", fields)} value={form.budget} onChange={set("budget")}>
            <option value="">Prefer not to say</option>
            {BUDGETS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Project details" name="message" error={fields.message}>
        <textarea
          {...fieldProps("message", fields)}
          rows={5}
          value={form.message}
          onChange={set("message")}
          placeholder="Tell us about your business, your goals and any timelines."
          className="field resize-y"
        />
      </Field>

      <FormError message={error} />

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted">
          By sending this you agree to our{" "}
          <a href="/privacy-policy" className="underline underline-offset-2 hover:text-ink">
            privacy policy
          </a>
          .
        </p>
        <button type="submit" disabled={status === "sending"} className="btn btn-primary btn-lg disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Send message"}
          <span className="btn-arrow">
            <Icon name="arrowUpRight" className="size-4" />
          </span>
        </button>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------- newsletter */

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const { status, error, fields, run, clearField } = useSubmit();

  if (status === "sent") {
    return (
      <p role="status" className="flex items-center gap-2 text-sm text-ink-soft">
        <Icon name="check" className="size-4 text-violet" /> You&apos;re subscribed. Thanks!
      </p>
    );
  }

  return (
    <form
      noValidate
      className="relative"
      onSubmit={(e) => {
        e.preventDefault();
        const payload = { email: email.trim(), website };
        run(validateNewsletter(payload), () => api.newsletter(payload));
      }}
    >
      <Honeypot value={website} onChange={setWebsite} />
      <div className="flex gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5 focus-within:border-violet">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearField("email");
          }}
          aria-invalid={fields.email ? true : undefined}
          placeholder="you@company.com"
          className="min-w-0 flex-1 bg-transparent px-3 text-sm text-ink outline-none placeholder:text-[#6f6488]"
        />
        <button type="submit" disabled={status === "sending"} className="btn btn-primary px-4 py-2 text-sm disabled:opacity-60">
          {status === "sending" ? "…" : "Subscribe"}
        </button>
      </div>
      {(fields.email || error) && <p className="mt-2 text-xs text-[#ff9db4]">{fields.email ?? error}</p>}
    </form>
  );
}

/* ------------------------------------------------------------- payment */

const EMPTY_PAYMENT = { invoiceNumber: "", name: "", email: "", amount: "", note: "", website: "" };

export function PaymentForm() {
  const [form, setForm] = useState(EMPTY_PAYMENT);
  const [redirecting, setRedirecting] = useState(false);
  const { status, setStatus, error, fields, run, clearField } = useSubmit();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    clearField(k === "amount" ? "amountCents" : k);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      invoiceNumber: form.invoiceNumber.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      amountCents: dollarsToCents(form.amount),
      note: form.note.trim() || undefined,
      website: form.website,
    };
    await run(validatePayment(payload), async () => {
      const res = await api.payment(payload);
      // If the backend created a hosted checkout session (e.g. Stripe), hand over to it.
      if (res.checkoutUrl) {
        setRedirecting(true);
        window.location.assign(res.checkoutUrl);
      }
    });
  }

  if (status === "sent" && !redirecting) {
    return (
      <Success
        title="Payment request received"
        body="We've recorded your invoice details and will email you a secure payment link shortly."
        onReset={() => {
          setForm(EMPTY_PAYMENT);
          setStatus("idle");
        }}
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5">
      <Honeypot value={form.website} onChange={(v) => setForm((f) => ({ ...f, website: v }))} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Invoice number" name="invoiceNumber" error={fields.invoiceNumber}>
          <input {...fieldProps("invoiceNumber", fields)} value={form.invoiceNumber} onChange={set("invoiceNumber")} placeholder="NW-1042" />
        </Field>
        <Field label="Amount (USD)" name="amountCents" error={fields.amountCents}>
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted">$</span>
            <input
              {...fieldProps("amountCents", fields)}
              inputMode="decimal"
              value={form.amount}
              onChange={set("amount")}
              placeholder="0.00"
              className="field pl-8 tabular-nums"
            />
          </div>
        </Field>
        <Field label="Full name" name="name" error={fields.name}>
          <input {...fieldProps("name", fields)} autoComplete="name" value={form.name} onChange={set("name")} placeholder="Name on the invoice" />
        </Field>
        <Field label="Email" name="email" error={fields.email}>
          <input {...fieldProps("email", fields)} type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="For your receipt" />
        </Field>
      </div>
      <Field label="Note" name="note" error={fields.note} optional>
        <textarea {...fieldProps("note", fields)} rows={3} value={form.note} onChange={set("note")} className="field resize-y" placeholder="Anything we should know about this payment?" />
      </Field>

      <FormError message={error} />

      <button type="submit" disabled={status === "sending" || redirecting} className="btn btn-primary btn-lg w-full justify-between disabled:opacity-60 sm:w-auto sm:self-end">
        <span className="flex items-center gap-2">
          <Icon name="lock" className="size-4" />
          {redirecting ? "Redirecting to secure checkout…" : status === "sending" ? "Processing…" : "Continue to payment"}
        </span>
        <span className="btn-arrow">
          <Icon name="arrowRight" className="size-4" />
        </span>
      </button>
    </form>
  );
}
