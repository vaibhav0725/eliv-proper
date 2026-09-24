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

function Marquee({ label, names }: { label: string; names: string[] }) {
  const ticker = `${names.join("   ·   ")}   ·   `;

  return (
    <div>
      <p className="px-6 text-[11px] font-medium tracking-[0.2em] text-zinc-500 uppercase sm:px-10 lg:px-14">
        {label}
      </p>
      <div className="mt-4 overflow-hidden border-y border-neutral-950/10 py-5">
        <div className="footer-marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <p
              key={copy}
              className="pr-8 text-lg font-medium tracking-tight whitespace-nowrap uppercase"
            >
              {ticker}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomePartners() {
  return (
    <section className="bg-white py-16 text-neutral-950 lg:py-24">
      <div className="mx-auto mb-12 w-full max-w-[1440px] px-6 sm:px-10 lg:px-14">
        <h2 className="text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.045em] uppercase">
          Our partners
        </h2>
      </div>
      <div className="flex flex-col gap-12">
        <Marquee label="Airlines" names={airlines} />
        <Marquee label="Shipping lines" names={lines} />
      </div>
    </section>
  );
}
