"use client";

import { useFormStatus } from "react-dom";
import { Icon } from "../Icon";

/** Delete with a confirm() guard. `action` is a Server Action taking the item's id. */
export function DeleteButton({
  id,
  label,
  action,
  compact = false,
}: {
  id: string;
  label: string;
  action: (formData: FormData) => Promise<void>;
  compact?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Delete “${label}”? This can't be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <DeleteSubmit compact={compact} label={label} />
    </form>
  );
}

function DeleteSubmit({ compact, label }: { compact: boolean; label: string }) {
  const { pending } = useFormStatus();
  return compact ? (
    <button
      type="submit"
      disabled={pending}
      aria-label={`Delete ${label}`}
      title="Delete"
      className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50"
    >
      <Icon name="trash" className="size-4" />
    </button>
  ) : (
    <button
      type="submit"
      disabled={pending}
      className="btn border border-danger/30 py-2.5 text-sm text-danger transition-colors hover:bg-danger/10 disabled:opacity-50"
    >
      <Icon name="trash" className="size-4" /> {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

/** One-click publish / unpublish from a list row. */
export function StatusToggle({
  id,
  published,
  action,
}: {
  id: string;
  published: boolean;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={published ? "DRAFT" : "PUBLISHED"} />
      <ToggleSubmit published={published} />
    </form>
  );
}

function ToggleSubmit({ published }: { published: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      title={published ? "Move back to drafts" : "Publish"}
      className="rounded-lg px-2.5 py-1.5 text-xs text-muted transition-colors hover:bg-white/[0.06] hover:text-ink disabled:opacity-50"
    >
      {pending ? "…" : published ? "Unpublish" : "Publish"}
    </button>
  );
}
