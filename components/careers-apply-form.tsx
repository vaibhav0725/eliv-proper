"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Job } from "@/backend/types";

const fieldClass =
  "mt-2 w-full border border-neutral-950/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-950";

export function CareersApplyForm({
  job,
  onClose,
}: {
  job: Job;
  onClose: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    try {
      const form = new FormData(event.currentTarget);
      form.set("jobId", job.id);
      const response = await fetch("/api/applications", {
        method: "POST",
        body: form,
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not send your application.");
        return;
      }
      setDone(true);
    } catch {
      setError("Could not send your application.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-neutral-950/50 p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close apply form"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-title"
        className="relative z-10 w-full max-w-lg bg-[#f3f3f1] p-6 text-neutral-950 shadow-2xl sm:p-8"
      >
        <p className="text-[10px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
          Apply now
        </p>
        <h3
          id="apply-title"
          className="mt-3 text-2xl leading-none font-bold tracking-[-0.04em] uppercase"
        >
          {job.heading}
        </h3>
        <p className="mt-2 text-sm text-zinc-500">
          {job.location} · {job.type}
        </p>

        {done ? (
          <div className="mt-8">
            <p className="text-sm leading-6 text-zinc-700">
              Your application and resume have been sent. We’ll review it and
              get back to you.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 bg-neutral-950 px-4 py-2.5 text-[11px] font-medium tracking-[0.16em] text-white uppercase"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-sm text-zinc-500">
              Full name
              <input name="name" required autoComplete="name" className={fieldClass} />
            </label>
            <label className="block text-sm text-zinc-500">
              Email
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className={fieldClass}
              />
            </label>
            <label className="block text-sm text-zinc-500">
              Phone
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                className={fieldClass}
              />
            </label>
            <label className="block text-sm text-zinc-500">
              Resume (PDF)
              <input
                name="resume"
                type="file"
                accept="application/pdf,.pdf"
                required
                className={`${fieldClass} file:mr-3 file:border-0 file:bg-transparent file:text-sm`}
              />
            </label>
            <label className="block text-sm text-zinc-500">
              Message
              <textarea name="message" rows={4} className={`${fieldClass} resize-y`} />
            </label>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={pending}
                className="bg-neutral-950 px-4 py-2.5 text-[11px] font-medium tracking-[0.16em] text-white uppercase disabled:opacity-60"
              >
                {pending ? "Sending…" : "Send application"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-[11px] font-medium tracking-[0.16em] text-zinc-500 uppercase"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
