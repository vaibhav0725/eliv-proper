"use client";

import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { FormEvent, useState } from "react";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: "500",
});

const inputClass =
  "w-full rounded-lg border border-black/10 bg-[#f4f4f2] px-3.5 py-2.5 text-sm text-neutral-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-neutral-950 focus:bg-white";

const photos = [
  {
    src: "/services/control.jpg",
    alt: "Team reviewing a logistics plan in a meeting",
  },
  {
    src: "/about/desk.jpg",
    alt: "Desk prepared for a planning session",
  },
  {
    src: "/about/warehouse.jpg",
    alt: "Warehouse floor used for freight handling",
  },
];

export function ConsultingCall() {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/consulting-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: String(form.get("fullName") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          company: String(form.get("company") ?? ""),
          preferredTime: String(form.get("preferredTime") ?? ""),
          message: String(form.get("message") ?? ""),
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not send your request.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Could not send your request.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="consulting-call" className="bg-[#f3f1ec] text-neutral-950">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-16 sm:px-10 lg:py-24">
        <div className="mx-auto max-w-xl text-center">
          <h2
            className={`${display.className} text-[clamp(2.4rem,4.5vw,3.5rem)] leading-[1.05] tracking-[-0.02em]`}
          >
            Book a Consulting Call
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-500">
            Share a few details about your business and we&apos;ll schedule a
            focused conversation with our consultants.
          </p>
        </div>

        <div className="mt-12 grid items-stretch gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          <div className="rounded-2xl bg-white p-6 shadow-[0_10px_40px_rgba(20,22,30,0.06)] sm:p-8">
            {submitted ? (
              <p role="status" className="text-sm leading-6 text-neutral-800">
                Thanks. We&apos;ll be in touch shortly to confirm a time.
              </p>
            ) : (
              <form className="flex h-full flex-col gap-5" onSubmit={onSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name" required>
                    <input
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Work Email" required>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@company.com"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Phone Number" required>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      placeholder="e.g. 0400 000 000"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="Your company"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Preferred date / time">
                  <input
                    name="preferredTime"
                    type="text"
                    placeholder="e.g. Tue 10:00 AM AEST"
                    className={inputClass}
                  />
                </Field>

                <Field label="How can we help?" required>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell us about your goals or the challenge you'd like to discuss..."
                    className={`${inputClass} resize-y`}
                  />
                </Field>

                {error ? <p className="text-sm text-red-700">{error}</p> : null}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-[#e6d3b4] px-5 text-[11px] font-semibold tracking-[0.14em] text-neutral-950 uppercase transition-colors hover:bg-[#dcc7a4] disabled:opacity-60"
                  >
                    {pending ? "Sending…" : "Request a call"}
                    <ArrowIcon />
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="grid gap-4 lg:h-full lg:grid-rows-[minmax(0,1.45fr)_minmax(0,1fr)]">
            <Photo {...photos[0]} className="aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-0" />
            <div className="grid grid-cols-2 gap-4 lg:min-h-0">
              <Photo {...photos[1]} className="aspect-[4/3] lg:aspect-auto lg:h-full" />
              <Photo {...photos[2]} className="aspect-[4/3] lg:aspect-auto lg:h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-[13px] font-medium text-neutral-800">
      <span>
        {label}
        {required ? <span aria-hidden> *</span> : null}
      </span>
      {children}
    </label>
  );
}

function Photo({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-neutral-200 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 520px, 100vw"
        className="object-cover"
      />
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
