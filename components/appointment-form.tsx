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
  "w-full border-b border-neutral-950/15 bg-transparent py-3 text-[15px] text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-950";

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
      <div role="status" className="flex min-h-[28rem] flex-col justify-center">
        <p className="text-[11px] font-medium tracking-[0.22em] text-neutral-500 uppercase">
          Received
        </p>
        <p className="mt-4 max-w-sm text-[clamp(2.2rem,4vw,3.4rem)] leading-[0.92] font-bold tracking-[-0.045em] uppercase">
          We’ll be in touch.
        </p>
        <p className="mt-5 max-w-sm text-sm leading-6 text-neutral-600">
          A reply comes back within one business day, from the desk that will
          handle the file.
        </p>
      </div>
    );
  }

  return (
    <form className="min-w-0" onSubmit={onSubmit}>
      <fieldset>
        <legend className="text-[11px] font-medium tracking-[0.18em] text-neutral-500 uppercase">
          Reason of enquiry
        </legend>
        <div className="mt-5 flex flex-wrap gap-2">
          {reasons.map((reason, index) => (
            <label key={reason} className="cursor-pointer">
              <input
                type="radio"
                name="reason"
                value={reason}
                required={index === 0}
                className="peer sr-only"
              />
              <span className="block rounded-full border border-neutral-950/12 px-3.5 py-2 text-[12px] tracking-wide text-neutral-700 transition-colors peer-checked:border-neutral-950 peer-checked:bg-neutral-950 peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-neutral-950 hover:border-neutral-950">
                {reason}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-10">
        <legend className="text-[11px] font-medium tracking-[0.18em] text-neutral-500 uppercase">
          Your information
        </legend>
        <div className="mt-8 grid gap-x-10 gap-y-7 sm:grid-cols-2">
          <label className="grid content-start gap-1 text-[11px] font-medium tracking-[0.16em] text-neutral-500 uppercase">
            Your full name
            <input
              name="fullName"
              type="text"
              autoComplete="name"
              required
              className={fieldClass}
            />
          </label>
          <label className="grid content-start gap-1 text-[11px] font-medium tracking-[0.16em] text-neutral-500 uppercase">
            <span>
              Company <span className="tracking-normal text-neutral-400 normal-case">(optional)</span>
            </span>
            <input
              name="company"
              type="text"
              autoComplete="organization"
              className={fieldClass}
            />
          </label>
          <label className="grid content-start gap-1 text-[11px] font-medium tracking-[0.16em] text-neutral-500 uppercase">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className={fieldClass}
            />
          </label>
          <label className="grid content-start gap-1 text-[11px] font-medium tracking-[0.16em] text-neutral-500 uppercase">
            Phone
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              className={fieldClass}
            />
          </label>
          <label className="grid content-start gap-1 text-[11px] font-medium tracking-[0.16em] text-neutral-500 uppercase sm:col-span-2">
            <span>
              Message <span className="tracking-normal text-neutral-400 normal-case">(optional)</span>
            </span>
            <textarea name="message" rows={4} className={`${fieldClass} resize-y`} />
          </label>
        </div>
      </fieldset>

      {error ? <p className="mt-8 text-sm text-red-700">{error}</p> : null}
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center rounded-full bg-[#e6d3b4] px-7 text-[11px] font-semibold tracking-[0.16em] text-neutral-950 uppercase transition-colors hover:bg-[#dcc7a4] disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send enquiry"}
        </button>
        <p className="text-sm text-neutral-500">Reply within one business day.</p>
      </div>
    </form>
  );
}
