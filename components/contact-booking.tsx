import { AppointmentForm } from "@/components/appointment-form";

const locations = [
  {
    city: "Melbourne",
    label: "Head office",
    lines: ["2A International Square,", "Tullamarine VIC 3043,", "Australia."],
  },
  {
    city: "Auckland",
    label: "New Zealand office",
    lines: ["Level 1, 84 Harris Road,", "East Tamaki, Auckland 2013,", "New Zealand."],
  },
  {
    city: "Hong Kong",
    label: "Hong Kong office",
    lines: [
      "Flat A, 2F, Tontex industrial building,",
      "2-4 Sheung Hei Street, San Po Kong,",
      "Kowloon, Hong Kong.",
    ],
  },
  {
    city: "Shenzhen",
    label: "China office",
    lines: [
      "Room 2001, Building B, 475 Bulong Rd,",
      "Bantian, Longgang,",
      "Shenzhen, China.",
    ],
  },
];

export function ContactBooking() {
  return (
    <section className="bg-[#f3f1ec] text-neutral-950">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <div className="lg:grid lg:grid-cols-[minmax(260px,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-x-16 xl:gap-x-24">
          <div className="max-w-md">
            <p className="text-[11px] font-medium tracking-[0.22em] text-neutral-500 uppercase">
              Appointments
            </p>
            <h2 className="mt-4 text-[clamp(2.6rem,4.6vw,4.2rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase">
              Book an
              <br />
              appointment
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-neutral-600">
              Tell us about the enquiry and we’ll call you back to set a time.
              The person who takes the note stays on the file.
            </p>
          </div>

          <div className="mt-10 bg-white px-6 py-8 shadow-[0_24px_70px_rgba(16,18,24,0.06)] sm:px-10 sm:py-12 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:px-12 lg:py-14">
            <AppointmentForm />
          </div>

          <div className="mt-16 max-w-md lg:mt-20">
            <p className="text-[11px] font-medium tracking-[0.22em] text-neutral-500 uppercase">
              Offices
            </p>
            <ul className="mt-6 border-t border-neutral-950/12">
              {locations.map((office, index) => (
                <li
                  key={office.city}
                  className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-4 border-b border-neutral-950/12 py-5"
                >
                  <p className="pt-1 text-[11px] tracking-[0.16em] text-neutral-400">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <p className="text-[15px] font-medium tracking-[-0.02em]">
                      {office.city}
                    </p>
                    <p className="mt-1 text-[11px] tracking-[0.14em] text-neutral-400 uppercase">
                      {office.label}
                    </p>
                    <address className="mt-2 text-sm leading-6 text-neutral-600 not-italic">
                      {office.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
