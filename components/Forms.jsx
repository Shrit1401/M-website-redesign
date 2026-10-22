"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ApiError, api } from "@/lib/api";
import {
  CURRENT_SYSTEMS,
  DEVICES,
  HARDWARE,
  MAX_DEVICES,
  MAX_LOCATIONS,
  PRODUCTS,
  TIMELINES,
  TOPICS,
  deviceTotals,
  validateContact,
  validateQuote,
} from "@/lib/forms";
import { DONATION_TYPES, OWNER } from "@/lib/content";
import { Arrow, EASE } from "./Motion";
import { LeafButterfly } from "./Butterfly";

/** Client-side check first, then the API, mapping server field errors back onto the form. */
function useSubmit() {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [fields, setFields] = useState({});

  async function run(errors, send) {
    setError("");
    setFields(errors);
    if (Object.keys(errors).length) {
      setError("Please check the highlighted fields.");
      // Land keyboard and screen-reader users on the first problem.
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    setStatus("sending");
    try {
      await send();
      setStatus("sent");
    } catch (e) {
      const err = e instanceof ApiError ? e : new ApiError("Something went wrong. Please try again.");
      setFields(err.fields);
      setError(err.message);
      setStatus("idle");
    }
  }

  const clear = (name) =>
    setFields((f) => {
      if (!f[name]) return f;
      const next = { ...f };
      delete next[name];
      return next;
    });

  return { status, setStatus, error, fields, run, clear };
}

const aria = (name, fields) => ({
  id: name,
  name,
  "aria-invalid": fields[name] ? true : undefined,
  "aria-describedby": fields[name] ? `${name}-error` : undefined,
});

function Field({ label, name, error, optional, full, children }) {
  return (
    <div className={`field ${full ? "field-full" : ""}`}>
      <label htmlFor={name}>
        {label} {optional && <span>(optional)</span>}
      </label>
      {children}
      {error && <span id={`${name}-error`} className="field-error">{error}</span>}
    </div>
  );
}

function Stepper({ name, label, hint, value, onChange, min = 0, max, error }) {
  const set = (n) => onChange(Math.max(min, Math.min(max, n)));
  return (
    <div className="field">
      <label htmlFor={name}>
        {label} {hint && <span>· {hint}</span>}
      </label>
      <div className="stepper">
        <button type="button" onClick={() => set(value - 1)} aria-label={`Fewer ${label.toLowerCase()}`}>−</button>
        <input
          {...{ id: name, name, "aria-invalid": error ? true : undefined }}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={Number.isNaN(value) ? "" : value}
          onChange={(e) => onChange(e.target.value === "" ? NaN : Math.floor(Number(e.target.value)))}
        />
        <button type="button" onClick={() => set((Number.isNaN(value) ? 0 : value) + 1)} aria-label={`More ${label.toLowerCase()}`}>+</button>
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

/** Hidden from people; bots that fill every input give themselves away. */
function Honeypot({ value, onChange }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Website
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

function FormError({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          role="alert"
          className="form-status is-error"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function Done({ title, body, onReset, resetLabel }) {
  return (
    <motion.div
      className="form-done"
      role="status"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="cta-bfly"><LeafButterfly flap slow /></div>
      <h2>{title}</h2>
      <p>{body}</p>
      <button type="button" className="btn btn-green" onClick={onReset}>{resetLabel}</button>
    </motion.div>
  );
}

/* ───────── Request a quote ───────── */

const EMPTY_QUOTE = {
  name: "",
  business: "",
  email: "",
  phone: "",
  role: "",
  locations: 1,
  city: "",
  devices: { registers: 1, kiosks: 0, kitchenDisplays: 1, printers: 0, terminals: 0 },
  products: ["register", "kitchen"],
  hardware: "",
  currentSystem: "",
  timeline: "",
  pilot: true,
  message: "",
  website: "",
};

export function QuoteForm() {
  const [form, setForm] = useState(EMPTY_QUOTE);
  const { status, setStatus, error, fields, run, clear } = useSubmit();
  const { perLocation, total } = deviceTotals(form);

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    clear(k);
  };
  const setDevice = (k) => (n) => {
    setForm((f) => ({ ...f, devices: { ...f.devices, [k]: n } }));
    clear(`devices.${k}`);
    clear("devices");
  };
  const toggleProduct = (value) => {
    setForm((f) => ({
      ...f,
      products: f.products.includes(value) ? f.products.filter((p) => p !== value) : [...f.products, value],
    }));
    clear("products");
  };

  async function onSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      name: form.name.trim(),
      business: form.business.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role.trim(),
      city: form.city.trim(),
      message: form.message.trim(),
    };
    await run(validateQuote(payload), () => api.quote(payload));
  }

  if (status === "sent") {
    return (
      <Done
        title="Quote request received."
        body={`Thanks, ${form.name.split(" ")[0]}. The Nebula Webtech team will review your setup — ${form.locations} location${form.locations > 1 ? "s" : ""}, ${total} devices — and reply to ${form.email} within one business day with clear numbers and a pilot plan.`}
        resetLabel="Start another quote"
        onReset={() => {
          setForm(EMPTY_QUOTE);
          setStatus("idle");
        }}
      />
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <Honeypot value={form.website} onChange={(v) => setForm((f) => ({ ...f, website: v }))} />

      <fieldset className="fieldset">
        <legend>01 · About you</legend>
        <Field label="Your name" name="name" error={fields.name}>
          <input {...aria("name", fields)} autoComplete="name" value={form.name} onChange={set("name")} />
        </Field>
        <Field label="Business name" name="business" error={fields.business}>
          <input {...aria("business", fields)} autoComplete="organization" value={form.business} onChange={set("business")} />
        </Field>
        <Field label="Email" name="email" error={fields.email}>
          <input {...aria("email", fields)} type="email" autoComplete="email" value={form.email} onChange={set("email")} />
        </Field>
        <Field label="Phone" name="phone" optional error={fields.phone}>
          <input {...aria("phone", fields)} type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} />
        </Field>
        <Field label="Your role" name="role" optional full>
          <input {...aria("role", fields)} placeholder="Owner, operations manager…" value={form.role} onChange={set("role")} />
        </Field>
      </fieldset>

      <fieldset className="fieldset">
        <legend>02 · Locations & devices</legend>
        <p className="fieldset-hint">Device counts are per location. We’ll help you test hardware during the pilot.</p>
        <Stepper
          name="locations"
          label="Locations"
          value={form.locations}
          min={1}
          max={MAX_LOCATIONS}
          error={fields.locations}
          onChange={(n) => {
            setForm((f) => ({ ...f, locations: n }));
            clear("locations");
          }}
        />
        <Field label="City / region" name="city" optional>
          <input {...aria("city", fields)} placeholder="e.g. Chicago, IL" value={form.city} onChange={set("city")} />
        </Field>
        {DEVICES.map((d) => (
          <Stepper
            key={d.key}
            name={`devices.${d.key}`}
            label={d.label}
            hint={d.hint}
            value={form.devices[d.key]}
            max={MAX_DEVICES}
            error={fields[`devices.${d.key}`]}
            onChange={setDevice(d.key)}
          />
        ))}
        <div className="field field-full">
          <div className="form-summary" aria-live="polite">
            <span>Per location <strong>{Number.isNaN(perLocation) ? "—" : perLocation} devices</strong></span>
            <span>Across {Number.isNaN(form.locations) ? "—" : form.locations} location{form.locations === 1 ? "" : "s"} <strong>{Number.isNaN(total) ? "—" : total} devices</strong></span>
          </div>
          {fields.devices && <span className="field-error" role="alert">{fields.devices}</span>}
        </div>
      </fieldset>

      <fieldset className="fieldset">
        <legend>03 · What you need</legend>
        <div className="field field-full">
          <span className="field-label" id="products-label">Products you’re interested in</span>
          <div className="checks" role="group" aria-labelledby="products-label">
            {PRODUCTS.map((p) => (
              <label key={p.value} className="check">
                <input
                  type="checkbox"
                  checked={form.products.includes(p.value)}
                  onChange={() => toggleProduct(p.value)}
                  aria-invalid={fields.products ? true : undefined}
                />
                <span>{p.label}</span>
              </label>
            ))}
          </div>
          {fields.products && <span className="field-error">{fields.products}</span>}
        </div>
        <Field label="Hardware" name="hardware" error={fields.hardware}>
          <select {...aria("hardware", fields)} value={form.hardware} onChange={set("hardware")}>
            <option value="" disabled>Choose one</option>
            {HARDWARE.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="What you use today" name="currentSystem" error={fields.currentSystem}>
          <select {...aria("currentSystem", fields)} value={form.currentSystem} onChange={set("currentSystem")}>
            <option value="" disabled>Choose one</option>
            {CURRENT_SYSTEMS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="When would you like to start?" name="timeline" error={fields.timeline}>
          <select {...aria("timeline", fields)} value={form.timeline} onChange={set("timeline")}>
            <option value="" disabled>Choose one</option>
            {TIMELINES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <div className="field">
          <span className="field-label">90-day pilot</span>
          <label className="check">
            <input type="checkbox" checked={form.pilot} onChange={set("pilot")} />
            <span>Yes, start with a pilot</span>
          </label>
        </div>
        <Field label="Anything else we should know?" name="message" optional full error={fields.message}>
          <textarea
            {...aria("message", fields)}
            placeholder="Menu size, opening hours, the problem you most want solved…"
            value={form.message}
            onChange={set("message")}
          />
        </Field>
      </fieldset>

      <FormError message={error} />
      <div className="form-foot">
        <button className="btn btn-green btn-lg" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : <>Request my quote <Arrow /></>}
        </button>
        <p>No commitment. {OWNER.name} replies within one business day. See our <a className="link" href="/privacy">Privacy Policy</a>.</p>
      </div>
    </form>
  );
}

/* ───────── Contact ───────── */

const EMPTY_CONTACT = { name: "", email: "", phone: "", business: "", topic: "", message: "", website: "" };

export function ContactForm() {
  const [form, setForm] = useState(EMPTY_CONTACT);
  const { status, setStatus, error, fields, run, clear } = useSubmit();

  // The Donate page sends types without a payment link here as /contact?topic=donation&type=…
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("topic") !== "donation") return;
    const type = DONATION_TYPES.find((t) => t.value === q.get("type"));
    setForm((f) => ({
      ...f,
      topic: "donation",
      message: f.message || `I’d like to make a donation${type ? `: ${type.label}` : ""}.`,
    }));
  }, []);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    clear(k);
  };

  async function onSubmit(e) {
    e.preventDefault();
    const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
    await run(validateContact(payload), () => api.contact(payload));
  }

  if (status === "sent") {
    return (
      <Done
        title="Message received."
        body={`Thanks for reaching out. Someone from the ${OWNER.name} team will contact you at ${form.email} within one business day (${OWNER.hours}).`}
        resetLabel="Send another message"
        onReset={() => {
          setForm(EMPTY_CONTACT);
          setStatus("idle");
        }}
      />
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <Honeypot value={form.website} onChange={(v) => setForm((f) => ({ ...f, website: v }))} />
      <fieldset className="fieldset">
        <legend>Send us a message</legend>
        <Field label="Your name" name="name" error={fields.name}>
          <input {...aria("name", fields)} autoComplete="name" value={form.name} onChange={set("name")} />
        </Field>
        <Field label="Email" name="email" error={fields.email}>
          <input {...aria("email", fields)} type="email" autoComplete="email" value={form.email} onChange={set("email")} />
        </Field>
        <Field label="Phone" name="phone" optional error={fields.phone}>
          <input {...aria("phone", fields)} type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} />
        </Field>
        <Field label="Business" name="business" optional error={fields.business}>
          <input {...aria("business", fields)} autoComplete="organization" value={form.business} onChange={set("business")} />
        </Field>
        <Field label="What’s this about?" name="topic" full error={fields.topic}>
          <select {...aria("topic", fields)} value={form.topic} onChange={set("topic")}>
            <option value="" disabled>Choose one</option>
            {TOPICS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="Message" name="message" full error={fields.message}>
          <textarea {...aria("message", fields)} value={form.message} onChange={set("message")} />
        </Field>
      </fieldset>
      <FormError message={error} />
      <div className="form-foot">
        <button className="btn btn-green btn-lg" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : <>Send message <Arrow /></>}
        </button>
        <p>{OWNER.name} will contact you within one business day. See our <a className="link" href="/privacy">Privacy Policy</a>.</p>
      </div>
    </form>
  );
}

/* ───────── Donate ───────── */

const payHref = (t) => t.payUrl || `/contact?topic=donation&type=${t.value}`;

/** Pick a donation type, then go to its payment page (or the contact form, for types arranged by hand). */
export function DonateForm() {
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const [leaving, setLeaving] = useState(false);
  const chosen = DONATION_TYPES.find((t) => t.value === type);

  // Deep links like /donate?type=monthly preselect the dropdown.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("type");
    if (DONATION_TYPES.some((t) => t.value === q)) setType(q);
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    if (!chosen) {
      setError("Choose a type of donation.");
      requestAnimationFrame(() => document.getElementById("donation-type")?.focus());
      return;
    }
    setLeaving(true);
    window.location.assign(payHref(chosen));
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <fieldset className="fieldset">
        <legend>Make a donation</legend>
        <Field label="Type of donation" name="donation-type" full error={error}>
          <select
            id="donation-type"
            name="donation-type"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "donation-type-error" : chosen ? "donation-type-desc" : undefined}
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setError("");
            }}
          >
            <option value="" disabled>Choose a type</option>
            {DONATION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </Field>
        <AnimatePresence mode="wait" initial={false}>
          {chosen && (
            <motion.div
              key={chosen.value}
              id="donation-type-desc"
              className="donate-chosen field-full"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <p className="label">{chosen.label}</p>
              <p>{chosen.body}</p>
              <p className="donate-next">
                {chosen.payUrl
                  ? "Next: our secure payment page, where you choose the amount."
                  : "Next: a short message to our team, who will arrange it with you."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </fieldset>
      <div className="form-foot">
        <button className="btn btn-green btn-lg" type="submit" disabled={leaving}>
          {leaving ? "Opening…" : chosen && !chosen.payUrl ? <>Arrange this donation <Arrow /></> : <>Continue to payment <Arrow /></>}
        </button>
        <p>Card details are entered on the payment provider’s page, never on this site. See our <a className="link" href="/refunds">Refund Policy</a>.</p>
      </div>
    </form>
  );
}
