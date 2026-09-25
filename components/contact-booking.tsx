import Image from "next/image";
import { AppointmentForm } from "@/components/appointment-form";

const locations = [
  {
    label: "Head office (Melbourne)",
    lines: ["2A International Square,", "Tullamarine VIC 3043,", "Australia."],
  },
  {
    label: "New Zealand office",
    lines: [
      "Level 1, 84 Harris Road, East Tamaki,",
      "Auckland 2013, New Zealand.",
    ],
  },
  {
    label: "Hong Kong office",
    lines: [
      "Flat A, 2F, Tontex industrial building,",
      "2-4 Sheung Hei Street, San Po Kong,",
      "Kowloon, Hong Kong.",
    ],
  },
  {
    label: "China office",
    lines: [
      "Room 2001, Building B, 475 Bulong Rd,",
      "Bantian, Longgang, Shenzhen,",
      "China.",
    ],
  },
];

export function ContactBooking() {
  return (
    <section className="bg-white text-neutral-950">
      <div className="mx-auto w-full max-w-[1440px] px-6 pt-4 pb-16 sm:px-10 lg:px-14 lg:pt-6 lg:pb-24">
        <div className="flex flex-col gap-8 border-b border-neutral-950/15 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
              Appointments
            </p>
            <h2 className="mt-4 max-w-xl text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase">
              Book an appointment
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-zinc-600">
            Tell us about your enquiry and we’ll call you back to schedule a
            time. We reply within one business day.
          </p>
        </div>

        <dl className="grid gap-6 border-b border-neutral-950/15 py-6 sm:grid-cols-3">
          <div>
            <dt className="text-[10px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
              Working hours
            </dt>
            <dd className="mt-2 text-sm">8:30AM – 5PM</dd>
          </div>
          <div>
            <dt className="text-[10px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
              Email
            </dt>
            <dd className="mt-2 text-sm">
              <a href="mailto:contact@unitedcarriers.com" className="hover:text-zinc-500">
                contact@unitedcarriers.com
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
              Socials
            </dt>
            <dd className="mt-2 text-sm">
              <a
                href="https://www.linkedin.com/company/united-carriers-apac/"
                className="hover:text-zinc-500"
              >
                LinkedIn
              </a>
            </dd>
          </div>
        </dl>

        <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.7fr)] lg:gap-16">
          <AppointmentForm />

          <aside>
            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
              <Image
                src="/contact-team.png"
                alt="United Carriers team in front of a company truck"
                fill
                sizes="(min-width: 1024px) 380px, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-8 text-[10px] font-medium tracking-[0.16em] text-zinc-500 uppercase">
              Locations
            </p>
            <ul className="mt-4">
              {locations.map((office, index) => (
                <li key={office.label} className="border-t border-neutral-950/15 py-4">
                  <p className="text-[11px] tracking-[0.14em] text-zinc-500">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-sm font-medium">{office.label}</p>
                  <address className="mt-1 text-sm leading-6 text-zinc-600 not-italic">
                    {office.lines.join(" ")}
                  </address>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
