"use client";

import { FormEvent, useState } from "react";
import type { LeadSource } from "@/backend/types";

export function FooterEmailField({
  id,
  placeholder,
  submitLabel,
  source,
}: {
  id: string;
  placeholder: string;
  submitLabel: string;
  source: LeadSource;
}) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not send.");
        return;
      }
      setDone(true);
      setEmail("");
    } catch {
      setError("Could not send.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-5 max-w-xs">
      {done ? (
        <p role="status" className="text-sm leading-6 text-zinc-600">
          Thanks — we’ll be in touch.
        </p>
      ) : (
        <form
          onSubmit={onSubmit}
          className="flex items-center rounded-full border border-black/15 py-1 pr-1 pl-4"
        >
          <label className="sr-only" htmlFor={id}>
            {submitLabel}
          </label>
          <input
            id={id}
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm text-neutral-950 outline-none placeholder:text-zinc-400"
          />
          <button
            type="submit"
            disabled={pending}
            aria-label={submitLabel}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-neutral-950 text-white disabled:opacity-60"
          >
            <ArrowIcon />
          </button>
        </form>
      )}
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
