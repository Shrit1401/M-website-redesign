"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icon";

type Mode = "signin" | "signup";

/** Front-end-only sign in / sign up panel for My Career Twin. Nothing is sent anywhere yet. */
export function CareerAuth() {
  const [mode, setMode] = useState<Mode>("signup");
  const [done, setDone] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = new FormData(e.currentTarget).get("name");
    setDone(mode === "signup" ? `Welcome${name ? `, ${name}` : ""}! Your career twin is on its way.` : "Welcome back!");
  };

  if (done) {
    return (
      <div className="card rounded-3xl p-8 text-center sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-soft text-brand">
          <Icon name="check" className="size-6" />
        </span>
        <p className="mt-6 text-2xl font-medium tracking-tight text-ink">{done}</p>
        <p className="mt-2 text-sm text-muted">Accounts open at launch. We’ll be in touch.</p>
        <Link
          href="/contact?tab=inquiry&topic=Job%20search%20marketing"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-brand hover:underline"
        >
          Looking for a job? We can market you <Icon name="arrowUpRight" className="size-3.5" />
        </Link>
        <br />
        <button type="button" onClick={() => setDone(null)} className="btn btn-outline mt-6">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="card rounded-3xl p-6 sm:p-8">
      <div role="tablist" aria-label="Account" className="grid grid-cols-2 gap-1 rounded-full bg-brand-soft p-1">
        {(
          [
            ["signup", "Sign up"],
            ["signin", "Sign in"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={`rounded-full py-2.5 text-sm font-medium transition-colors ${
              mode === id ? "bg-white text-ink shadow-sm" : "text-ink-soft hover:text-brand"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        {mode === "signup" && (
          <label className="block">
            <span className="mb-1.5 block text-sm text-ink-soft">Full name</span>
            <input name="name" required autoComplete="name" className="field" placeholder="Jane Doe" />
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-sm text-ink-soft">Email</span>
          <input name="email" type="email" required autoComplete="email" className="field" placeholder="you@example.com" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-ink-soft">Password</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className="field"
            placeholder="At least 8 characters"
          />
        </label>
        {mode === "signin" && (
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-ink-soft">
              <input type="checkbox" className="accent-[var(--brand)]" /> Remember me
            </label>
            <button type="button" className="text-brand hover:underline">
              Forgot password?
            </button>
          </div>
        )}
        <button type="submit" className="btn btn-primary w-full justify-between">
          {mode === "signup" ? "Create my career twin" : "Sign in"} <Icon name="arrowRight" className="size-4" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {mode === "signup" ? "Already have an account? " : "New to My Career Twin? "}
        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="text-brand hover:underline"
        >
          {mode === "signup" ? "Sign in" : "Sign up"}
        </button>
      </p>
    </div>
  );
}
