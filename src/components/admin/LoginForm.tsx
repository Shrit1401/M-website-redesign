"use client";

import { useActionState, useState } from "react";
import { login } from "@/app/admin/actions";
import type { FormState } from "@/lib/content/schema";
import { Icon } from "../Icon";
import { FormAlert, SubmitButton } from "./fields";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(login, {});
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  return (
    <form action={formAction} className="grid gap-5">
      {next && <input type="hidden" name="next" value={next} />}
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-soft">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={state.fields?.password ? true : undefined}
            className="field pr-12"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-ink"
          >
            <Icon name="eye" className="size-4" />
          </button>
        </div>
      </div>
      <FormAlert message={state.error} />
      <SubmitButton pendingText="Signing in…">
        Sign in <Icon name="arrowRight" className="size-4" />
      </SubmitButton>
    </form>
  );
}
