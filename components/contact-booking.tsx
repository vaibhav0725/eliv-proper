import { AppointmentForm } from "@/components/appointment-form";
import { contact, legalName } from "@/lib/seo";

const mapQuery = "Five Greentree Centre, STE. 104, Marlton, NJ 08053";
const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`;
const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

const locations = [
  {
    city: "Marlton",
    label: legalName,
    lines: [
      "Five Greentree Centre, STE. 104,",
      "Marlton, NJ 08053,",
      "USA.",
    ],
    phone: contact.telephoneDisplay,
    phoneHref: contact.telephoneHref,
    email: contact.email,
  },
];

export function ContactBooking() {
  return (
    <section className="bg-[#f3f1ec] text-neutral-950">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <div className="lg:grid lg:grid-cols-[minmax(260px,0.78fr)_minmax(0,1.22fr)] lg:items-stretch lg:gap-x-16 xl:gap-x-24">
          <div className="flex h-full flex-col">
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

          <div className="mt-10 flex min-h-0 flex-1 flex-col lg:mt-14">
            <p className="text-[11px] font-medium tracking-[0.22em] text-neutral-500 uppercase">
              Offices
            </p>
            <ul className="mt-6 max-w-md border-t border-neutral-950/12">
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
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      <a href={office.phoneHref} className="hover:text-neutral-950">
                        {office.phone}
                      </a>
                      {" · "}
                      <a href={`mailto:${office.email}`} className="hover:text-neutral-950">
                        {office.email}
                      </a>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <a
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-[11px] tracking-[0.14em] text-neutral-500 uppercase underline decoration-neutral-300 underline-offset-4 hover:text-neutral-950"
            >
              Open in Google Maps
            </a>
            <div className="relative mt-4 h-52 max-w-md overflow-hidden bg-neutral-200 lg:h-auto lg:min-h-0 lg:flex-1">
              <iframe
                title="Map of the Eliv Logistics office in Marlton, New Jersey"
                src={mapSrc}
                className="h-full w-full border-0 lg:absolute lg:inset-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          </div>

          <div className="mt-10 h-full bg-white px-6 py-8 shadow-[0_24px_70px_rgba(16,18,24,0.06)] sm:px-10 sm:py-12 lg:mt-0 lg:px-12 lg:py-14">
            <AppointmentForm />
          </div>
        </div>
      </div>
    </section>
  );
}
