import Link from "next/link";

const pins = [
  { id: "europe", top: "28%", left: "49%" },
  { id: "middle-east", top: "40%", left: "60%" },
  { id: "india", top: "46%", left: "68%" },
  { id: "china", top: "38%", left: "78%" },
  { id: "hong-kong", top: "46%", left: "80%" },
  { id: "southeast-asia", top: "54%", left: "79%" },
  { id: "australia", top: "74%", left: "86%" },
  { id: "new-zealand", top: "82%", left: "94%" },
];

export function ContactHero() {
  return (
    <section className="bg-white text-neutral-950">
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col px-6 pt-8 pb-4 sm:px-10 lg:px-14">
        <div className="flex justify-end">
          <Link
            href="/careers"
            className="inline-flex h-11 items-center rounded-full bg-neutral-950 px-5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase"
          >
            Work with us
          </Link>
        </div>

        <div className="grid items-center gap-8 py-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:py-6">
          <div className="max-w-3xl lg:pl-[6%]">
            <h1 className="text-[clamp(4.6rem,9.2vw,8.4rem)] leading-[0.82] font-black tracking-[-0.05em] uppercase">
              Get
              <br />
              in touch
            </h1>
            <p className="mt-6 max-w-md text-sm text-neutral-800 sm:text-[15px]">
              Have a question or need support? Our team is here to help.
            </p>
          </div>

          <div
            aria-hidden
            className="relative mx-auto aspect-[950/620] w-full max-w-[560px]"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #b5b5b5 1.05px, transparent 1.15px)",
                backgroundSize: "4px 4px",
                WebkitMaskImage: "url(/world-map.svg)",
                maskImage: "url(/world-map.svg)",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                WebkitMaskSize: "contain",
                maskSize: "contain",
              }}
            />
            {pins.map((pin) => (
              <span
                key={pin.id}
                className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2f6bff]"
                style={{ top: pin.top, left: pin.left }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
