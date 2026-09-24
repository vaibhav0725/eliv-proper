const strip =
  "Specialist solutions for project cargo, sensitive, industrial & defence logistics.   ···   International freight, customs brokerage, logistics, and domestic transport services.   ···   ";

export function ServicesHero() {
  return (
    <section className="relative flex h-[calc(100svh-4.25rem)] min-h-[560px] flex-col justify-end overflow-hidden bg-black text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      >
        <source src="/video/services-hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 px-6 pb-8 sm:px-10 lg:px-14 lg:pb-10">
        <h1 className="text-[clamp(3.2rem,7.2vw,6.75rem)] leading-[0.88] font-bold tracking-[-0.04em] uppercase">
          Global
          <br />
          Supply chain
          <br />
          Coverage
        </h1>
      </div>

      <div className="relative z-10 overflow-hidden border-t border-white/25 py-3">
        <div className="footer-marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <p
              key={copy}
              className="pr-8 text-[11px] tracking-[0.16em] whitespace-nowrap text-white/90 uppercase"
            >
              {strip}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
