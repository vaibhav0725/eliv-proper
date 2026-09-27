"use client";

import { FormEvent, useState } from "react";

const reasons = [
  "Air Freight",
  "Domestic & Interstate Transport",
  "Sea Freight",
  "APAC Emerging Markets",
  "Brokerage",
  "Tariff/Compliance Audits",
  "Consolidation Programs",
  "Careers",
  "3PL",
  "Partnership",
  "Crossdock/By-pass Solutions",
  "Other",
];

const fieldClass =
  "mt-2 w-full border border-black/10 bg-white px-3 py-3 text-sm text-neutral-950 outline-none transition-colors focus:border-neutral-950";

export function AppointmentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: String(form.get("reason") ?? ""),
          fullName: String(form.get("fullName") ?? ""),
          company: String(form.get("company") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          message: String(form.get("message") ?? ""),
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not send your enquiry.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Could not send your enquiry.");
    } finally {
      setPending(false);
    }
  }

  if (submitted) {
    return (
      <p role="status" className="text-sm leading-6 text-neutral-800">
        Thanks for reaching out. We’ll get back to you shortly.
      </p>
    );
  }

  return (
    <form className="min-w-0" onSubmit={onSubmit}>
      <fieldset>
        <legend className="text-[10px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
          Reason of enquiry
        </legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {reasons.map((reason, index) => (
            <label key={reason} className="cursor-pointer">
              <input
                type="radio"
                name="reason"
                value={reason}
                required={index === 0}
                className="peer sr-only"
              />
              <span className="block border border-black/10 px-3 py-2 text-xs tracking-wide text-neutral-700 transition-colors peer-checked:border-neutral-950 peer-checked:bg-neutral-950 peer-checked:text-white hover:border-neutral-950">
                {reason}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-10">
        <legend className="text-[10px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
          Your information
        </legend>
        <div className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          <label className="grid gap-1 text-sm text-zinc-500">
            Your full name
            <input
              name="fullName"
              type="text"
              autoComplete="name"
              required
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1 text-sm text-zinc-500">
            <span>
              Company name <span className="text-zinc-400">(optional)</span>
            </span>
            <input
              name="company"
              type="text"
              autoComplete="organization"
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1 text-sm text-zinc-500">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1 text-sm text-zinc-500">
            Phone
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1 text-sm text-zinc-500 sm:col-span-2">
            <span>
              Message <span className="text-zinc-400">(optional)</span>
            </span>
            <textarea name="message" rows={3} className={`${fieldClass} resize-y`} />
          </label>
        </div>
      </fieldset>

      {error ? <p className="mt-6 text-sm text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex h-11 items-center rounded-full bg-neutral-950 px-5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase disabled:opacity-60"
      >
        {pending ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
