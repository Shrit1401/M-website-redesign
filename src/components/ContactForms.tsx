"use client";

import { useState } from "react";
import { ENGAGEMENT_LABELS, INQUIRY_TOPICS, REQUIREMENT_SERVICES, SITE, type EngagementId } from "@/lib/content";
import { Icon } from "./Icon";

type Status = "idle" | "sending" | "sent" | "error";

async function submit(payload: Record<string, unknown>) {
  const res = await fetch("/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
}

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <span className="mb-1.5 block text-sm font-medium text-ink-soft">
      {children} {optional && <span className="font-normal text-muted">(optional)</span>}
    </span>
  );
}

function Success({ title, body, onReset }: { title: string; body: string; onReset: () => void }) {
  return (
    <div className="py-14 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-soft text-brand">
        <Icon name="check" className="size-7" />
      </span>
      <h3 className="mt-5 text-2xl font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-muted">{body}</p>
      <button type="button" onClick={onReset} className="btn btn-outline mt-8">
        Send another
      </button>
    </div>
  );
}

/* ---------------- Get a quote (multi-step) ---------------- */

const STEPS = ["About you", "Your project", "Details"];

const EMPTY_REQ = {
  name: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  engagement: "hire" as EngagementId,
  services: [] as string[],
  marketing: "",
  description: "",
  goals: "",
  timeline: "",
  budget: "",
  company_url: "", // honeypot
};

function withEngagement(f: typeof EMPTY_REQ, engagement: EngagementId) {
  return { ...f, engagement, marketing: engagement === "career" ? "self" : f.marketing };
}

export function QuoteForm({ initialEngagement = null }: { initialEngagement?: EngagementId | null }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() =>
    initialEngagement ? withEngagement(EMPTY_REQ, initialEngagement) : EMPTY_REQ,
  );
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const toggleService = (s: string) =>
    set("services", form.services.includes(s) ? form.services.filter((x) => x !== s) : [...form.services, s]);

  function next(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    setStatus("sending");
    submit({ kind: "requirements", ...form })
      .then(() => setStatus("sent"))
      .catch((err: Error) => {
        setError(err.message);
        setStatus("error");
      });
  }

  if (status === "sent") {
    return (
      <Success
        title="Quote request received."
        body="Thanks — our team will review your project and reply with next steps and a custom quote within 1–2 business days."
        onReset={() => {
          setForm(initialEngagement ? withEngagement(EMPTY_REQ, initialEngagement) : EMPTY_REQ);
          setStep(0);
          setStatus("idle");
        }}
      />
    );
  }

  return (
    <form onSubmit={next}>
      {/* Stepper */}
      <ol className="mb-8 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-medium transition-colors ${
                i <= step ? "bg-brand text-white" : "bg-brand-soft text-brand"
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step ? <Icon name="check" className="size-4" /> : i + 1}
            </button>
            <span className={`hidden text-sm sm:inline ${i === step ? "text-ink" : "text-muted"}`}>{s}</span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px flex-1 bg-line" />}
          </li>
        ))}
      </ol>

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
        value={form.company_url}
        onChange={(e) => set("company_url", e.target.value)}
      />

      {step === 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label>
            <Label>Full name</Label>
            <input
              className="field"
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              autoComplete="name"
            />
          </label>
          <label>
            <Label>Work email</Label>
            <input
              className="field"
              type="email"
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              autoComplete="email"
            />
          </label>
          <label>
            <Label optional>Phone</Label>
            <input
              className="field"
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              autoComplete="tel"
            />
          </label>
          <label>
            <Label>Company / organization</Label>
            <input
              className="field"
              required
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              autoComplete="organization"
            />
          </label>
          <label className="sm:col-span-2">
            <Label optional>Current website or app URL</Label>
            <input
              className="field"
              type="url"
              placeholder="https://"
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
            />
          </label>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-7">
          <fieldset>
            <legend className="mb-3 text-sm font-medium text-ink-soft">How would you like to work with us?</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(ENGAGEMENT_LABELS) as EngagementId[]).map((id) => (
                <label
                  key={id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition-colors ${
                    form.engagement === id
                      ? "border-brand bg-brand-soft/60 text-ink"
                      : "border-line bg-white text-ink-soft hover:border-brand/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="engagement"
                    className="mt-0.5 accent-[var(--brand)]"
                    checked={form.engagement === id}
                    onChange={() => set("engagement", id)}
                  />
                  {ENGAGEMENT_LABELS[id]}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 text-sm font-medium text-ink-soft">Services you need</legend>
            <div className="flex flex-wrap gap-2">
              {REQUIREMENT_SERVICES.map((s) => {
                const on = form.services.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    aria-pressed={on}
                    onClick={() => toggleService(s)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      on
                        ? "border-brand bg-brand text-white"
                        : "border-line bg-white text-ink-soft hover:border-brand/50"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="block">
            <Label>Who will handle marketing?</Label>
            <select
              className="field"
              required
              value={form.marketing}
              onChange={(e) => set("marketing", e.target.value)}
            >
              <option value="" disabled>
                Select one
              </option>
              <option value="self">We’ll do our own marketing</option>
              <option value="macro">We’d like Macro to handle marketing</option>
              <option value="undecided">Undecided</option>
            </select>
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <Label>Describe what you need built or changed</Label>
            <textarea
              className="field min-h-32"
              required
              minLength={20}
              placeholder="Features, users, integrations, modifications needed…"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </label>
          <label className="sm:col-span-2">
            <Label optional>Goals / success metrics</Label>
            <input className="field" value={form.goals} onChange={(e) => set("goals", e.target.value)} />
          </label>
          <label>
            <Label>Timeline</Label>
            <select className="field" required value={form.timeline} onChange={(e) => set("timeline", e.target.value)}>
              <option value="" disabled>
                Select one
              </option>
              <option>ASAP (under 1 month)</option>
              <option>1–3 months</option>
              <option>3–6 months</option>
              <option>Flexible</option>
            </select>
          </label>
          <label>
            <Label optional>Budget range</Label>
            <select className="field" value={form.budget} onChange={(e) => set("budget", e.target.value)}>
              <option value="">Prefer to discuss</option>
              <option>Under $5k</option>
              <option>$5k – $15k</option>
              <option>$15k – $50k</option>
              <option>$50k+</option>
            </select>
          </label>
        </div>
      )}

      {error && <p className="mt-5 text-sm text-red-600">{error}</p>}

      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} className="btn btn-outline">
            Back
          </button>
        ) : (
          <span className="text-xs text-muted">Takes about 2 minutes.</span>
        )}
        <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-60">
          {step < STEPS.length - 1 ? "Continue" : status === "sending" ? "Sending…" : "Get my custom quote"}
          <Icon name="arrowRight" className="size-4" />
        </button>
      </div>
    </form>
  );
}

/* ---------------- Regular inquiry ---------------- */

const EMPTY_INQ = { name: "", email: "", topic: "General question", message: "", company_url: "" };

export function InquiryForm({ initialTopic }: { initialTopic?: string }) {
  const [form, setForm] = useState(() => (initialTopic ? { ...EMPTY_INQ, topic: initialTopic } : EMPTY_INQ));
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  if (status === "sent") {
    return (
      <Success
        title="Message sent."
        body="Thanks for reaching out — we usually reply within one business day."
        onReset={() => {
          setForm(EMPTY_INQ);
          setStatus("idle");
        }}
      />
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("sending");
        setError("");
        submit({ kind: "inquiry", ...form })
          .then(() => setStatus("sent"))
          .catch((err: Error) => {
            setError(err.message);
            setStatus("error");
          });
      }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
        value={form.company_url}
        onChange={(e) => set("company_url", e.target.value)}
      />
      <label>
        <Label>Name</Label>
        <input
          className="field"
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          autoComplete="name"
        />
      </label>
      <label>
        <Label>Email</Label>
        <input
          className="field"
          type="email"
          required
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          autoComplete="email"
        />
      </label>
      <label className="sm:col-span-2">
        <Label>Topic</Label>
        <select className="field" value={form.topic} onChange={(e) => set("topic", e.target.value)}>
          {INQUIRY_TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="sm:col-span-2">
        <Label>Message</Label>
        <textarea
          className="field min-h-36"
          required
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </label>
      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
        <a href={`mailto:${SITE.email}`} className="text-sm text-muted hover:text-brand">
          or email {SITE.email}
        </a>
        <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Send inquiry"} <Icon name="arrowRight" className="size-4" />
        </button>
      </div>
    </form>
  );
}
