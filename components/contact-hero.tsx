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
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col px-6 pt-24 pb-4 sm:px-10 lg:px-14 lg:pt-28">
        <div className="grid items-center gap-8 py-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:py-4">
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
            className="relative mx-auto aspect-[950/620] w-full max-w-[420px] lg:mx-0 lg:ml-auto"
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
