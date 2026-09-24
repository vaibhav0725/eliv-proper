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

const labelClass =
  "text-[10px] font-medium tracking-[0.16em] text-zinc-400 uppercase";

export function ContactBooking() {
  return (
    <section className="border-t border-black/10 bg-white text-neutral-950">
      <div className="mx-auto grid w-full max-w-[1440px] gap-14 px-6 py-16 sm:px-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.2fr)_minmax(0,0.85fr)] lg:gap-12 lg:px-14 lg:py-20">
        <div>
          <Image
            src="/contact-team.png"
            alt="United Carriers team in front of a company truck"
            width={588}
            height={400}
            className="h-auto w-full max-w-[280px]"
          />
          <dl className="mt-8 space-y-6">
            <div>
              <dt className={labelClass}>Working hours</dt>
              <dd className="mt-2 text-sm font-medium">
                8:30AM -<br />
                5PM
              </dd>
            </div>
            <div>
              <dt className={labelClass}>Socials</dt>
              <dd className="mt-2 text-sm">
                <a
                  href="https://www.linkedin.com/company/united-carriers-apac/"
                  className="underline decoration-black/30 underline-offset-2"
                >
                  LinkedIn
                </a>
              </dd>
            </div>
            <div>
              <dt className={labelClass}>Email</dt>
              <dd className="mt-2 text-sm">
                <a
                  href="mailto:contact@unitedcarriers.com"
                  className="underline decoration-black/30 underline-offset-2"
                >
                  contact@unitedcarriers.com
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <AppointmentForm />

        <div>
          <h2 className="border-b border-black/80 pb-3 text-2xl font-bold tracking-tight uppercase sm:text-[1.7rem]">
            Locations
          </h2>
          <ul className="mt-6 space-y-7">
            {locations.map((office) => (
              <li key={office.label}>
                <p className={labelClass}>{office.label}</p>
                <address className="mt-2 text-sm leading-snug not-italic">
                  {office.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
