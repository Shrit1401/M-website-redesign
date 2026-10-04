"use client";

import { useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { renderMarkdown } from "@/lib/markdown";
import { Icon } from "../Icon";

/*
 * Form building blocks for the admin editors. Inputs are controlled: React 19 resets uncontrolled
 * fields after a form action finishes, which would wipe the editor whenever the server returns a
 * validation error. See docs/design/08-admin.md.
 */

export function Label({ htmlFor, children, hint }: { htmlFor: string; children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-3 text-sm font-medium text-ink-soft">
      <span>{children}</span>
      {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message?.trim()) return null;
  return (
    <span id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs text-[#ff9db4]">
      <Icon name="alert" className="size-3.5" /> {message}
    </span>
  );
}

const invalid = (name: string, error?: string) =>
  error ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` } : {};

type Common = { name: string; label: string; value: string; onChange: (v: string) => void; error?: string; hint?: React.ReactNode };

export function TextField({
  name,
  label,
  value,
  onChange,
  error,
  hint,
  prefix,
  className = "",
  ...rest
}: Common & { prefix?: string; className?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "prefix">) {
  return (
    <div className={className}>
      <Label htmlFor={name} hint={hint}>
        {label}
      </Label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-muted">{prefix}</span>
        )}
        <input
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field"
          style={prefix ? { paddingLeft: `${prefix.length * 0.5 + 1.25}rem` } : undefined}
          {...invalid(name, error)}
          {...rest}
        />
      </div>
      <FieldError id={name} message={error} />
    </div>
  );
}

export function TextArea({
  name,
  label,
  value,
  onChange,
  error,
  hint,
  max,
  rows = 3,
  placeholder,
}: Common & { max?: number; rows?: number; placeholder?: string }) {
  return (
    <div>
      <Label htmlFor={name} hint={max ? <span className={value.length > max ? "text-[#ff9db4]" : ""}>{`${value.length}/${max}`}</span> : hint}>
        {label}
      </Label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="field resize-y"
        {...invalid(name, error)}
      />
      <FieldError id={name} message={error} />
    </div>
  );
}

export function Select({
  name,
  label,
  value,
  onChange,
  error,
  options,
}: Common & { options: readonly { value: string; label: string }[] }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <select id={name} name={name} value={value} onChange={(e) => onChange(e.target.value)} className="field" {...invalid(name, error)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <FieldError id={name} message={error} />
    </div>
  );
}

/** Radio group styled as a segmented control. */
export function Segmented({
  name,
  label,
  value,
  onChange,
  options,
  error,
}: Common & { options: readonly { value: string; label: string; hint?: string }[] }) {
  const id = useId();
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-ink-soft">{label}</legend>
      <div className="grid gap-1 rounded-2xl border border-white/10 bg-white/[0.02] p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => (
          <label
            key={o.value}
            htmlFor={`${id}-${o.value}`}
            className={`cursor-pointer rounded-xl px-2 py-2 text-center text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-violet ${
              value === o.value ? "bg-white/[0.1] text-ink shadow-[inset_0_0_0_1px_rgb(255_255_255/0.1)]" : "text-muted hover:text-ink"
            }`}
          >
            <input
              id={`${id}-${o.value}`}
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
      {options.find((o) => o.value === value)?.hint && (
        <p className="mt-2 text-xs leading-relaxed text-muted">{options.find((o) => o.value === value)?.hint}</p>
      )}
      <FieldError id={name} message={error} />
    </fieldset>
  );
}

export function Toggle({ name, label, hint, checked, onChange }: { name: string; label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={name} className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      </span>
      <input id={name} name={name} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden
        className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full border border-white/15 bg-white/[0.06] transition-colors peer-checked:border-violet peer-checked:bg-violet/80 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet after:absolute after:top-0.5 after:left-0.5 after:size-[1.125rem] after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5"
      />
    </label>
  );
}

/** Markdown editor with Write / Preview tabs. Preview uses the same renderer as the public pages. */
export function MarkdownField({ name, label, value, onChange, error, rows = 18 }: Common & { rows?: number }) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  return (
    <div>
      <div className="mb-1.5 flex items-end justify-between gap-3">
        <Label htmlFor={name} hint={<span className="hidden sm:inline">Markdown · ## heading, **bold**, - list, [link](https://…)</span>}>
          {label}
        </Label>
      </div>
      <div className={`overflow-hidden rounded-[0.9rem] border ${error ? "border-[#ff7a9a]" : "border-white/[0.16]"} focus-within:border-violet`}>
        <div role="tablist" aria-label={`${label} editor`} className="flex items-center gap-1 border-b border-white/[0.08] bg-white/[0.02] p-1.5">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                tab === t ? "bg-white/[0.1] text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
          <span className="ml-auto pr-2 text-xs text-muted tabular-nums">
            {value.split(/\s+/).filter(Boolean).length.toLocaleString()} words
          </span>
        </div>
        {/* The textarea stays mounted while previewing so the value is always submitted. */}
        <textarea
          id={name}
          name={name}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full resize-y bg-white/[0.02] px-4 py-3 font-mono text-sm leading-relaxed text-ink outline-none placeholder:text-[#6f6488] ${
            tab === "preview" ? "hidden" : ""
          }`}
          placeholder={"## The challenge\n\nWhat the client needed…\n\n## What we built\n\n- Responsive design\n- …"}
          {...invalid(name, error)}
        />
        {tab === "preview" && (
          <div className="min-h-64 bg-bg px-6 py-6">
            {value.trim() ? (
              <div className="prose-nebula" dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }} />
            ) : (
              <p className="text-sm text-muted">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>
      <FieldError id={name} message={error} />
    </div>
  );
}

export function Panel({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-white/[0.08] bg-surface/70 p-5 sm:p-6 ${className}`}>
      {title && <h2 className="mb-5 text-xs font-semibold tracking-[0.2em] text-muted uppercase">{title}</h2>}
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

export function SubmitButton({ children, pendingText = "Saving…" }: { children: React.ReactNode; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary py-2.5 text-sm disabled:opacity-60">
      {pending ? pendingText : children}
    </button>
  );
}

export function FormAlert({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/[0.08] px-4 py-3 text-sm text-[#ffc2d0]">
      <Icon name="alert" className="mt-0.5 size-4 shrink-0" /> {message}
    </p>
  );
}
