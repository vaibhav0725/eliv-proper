"use client";

import { useState } from "react";

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
  "w-full border-b border-black/15 bg-transparent py-2 text-sm text-neutral-950 outline-none";

export function AppointmentForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p role="status" className="text-sm leading-6 text-neutral-800">
        Thanks for reaching out. We’ll get back to you shortly.
      </p>
    );
  }

  return (
    <form
      className="min-w-0"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <h2 className="text-2xl font-bold tracking-tight uppercase sm:text-[1.7rem]">
        Book an appointment
      </h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-neutral-800">
        Use the form below to tell us about your enquiry and we’ll call you
        back to schedule an appointment. Our general response time is within
        one business day.
      </p>

      <fieldset className="mt-8">
        <legend className="text-sm font-semibold">Reason of enquiry</legend>
        <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {reasons.map((reason, index) => (
            <label
              key={reason}
              className="flex items-start gap-2.5 text-sm leading-snug"
            >
              <input
                type="radio"
                name="reason"
                value={reason}
                required={index === 0}
                className="mt-0.5 size-4 shrink-0 accent-neutral-950"
              />
              {reason}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-10 border-t border-black/10 pt-8">
        <legend className="text-sm font-semibold">Your information</legend>
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

      <button
        type="submit"
        className="mt-8 inline-flex h-11 items-center rounded-full bg-neutral-950 px-5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase"
      >
        Submit
      </button>
    </form>
  );
}
