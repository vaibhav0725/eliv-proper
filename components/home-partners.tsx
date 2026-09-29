const airlines = [
  "Air China",
  "Vietnam Airlines",
  "British Airways",
  "Fiji Airways",
  "Malaysia Airlines",
  "China Southern",
  "Qatar Airways",
  "China Eastern",
  "Qantas",
  "Air New Zealand",
  "Etihad",
  "Cathay Pacific",
  "Singapore Airlines",
  "United",
  "Emirates",
  "Air India",
  "Thai Airways",
];

const lines = [
  "Hamburg Süd",
  "ZIM",
  "CMA CGM",
  "Wallenius Wilhelmsen",
  "Sinotrans",
  "NYK Line",
  "K Line",
  "COSCO",
  "Evergreen",
  "Yang Ming",
  "PIL",
  "MSC",
  "HMM",
  "Maersk",
  "APL",
];

export function HomePartners() {
  return (
    <section className="bg-white text-neutral-950">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(240px,22rem)] lg:items-end">
          <h2 className="text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase">
            Our partners
          </h2>
          <p className="max-w-sm text-sm leading-6 text-zinc-600 lg:pb-1">
            Airlines and shipping lines we place freight with.
          </p>
        </div>

        <div className="mt-14 grid gap-12 border-t border-neutral-950/15 pt-10 lg:grid-cols-2 lg:gap-20">
          <NameColumn label="Airlines" names={airlines} />
          <NameColumn label="Shipping lines" names={lines} />
        </div>
      </div>
    </section>
  );
}

function NameColumn({ label, names }: { label: string; names: string[] }) {
  return (
    <div>
      <p className="text-[11px] font-medium tracking-[0.2em] text-zinc-500 uppercase">
        {label}
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-x-8 border-t border-neutral-950/15">
        {names.map((name) => (
          <li
            key={name}
            className="border-b border-neutral-950/10 py-3 text-sm tracking-tight text-neutral-950"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
