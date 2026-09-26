export function IndustriesHero() {
  return (
    <section className="relative h-svh min-h-[560px] overflow-hidden bg-black text-white">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/25" />

      <p className="absolute top-[42%] right-6 z-10 max-w-[15rem] text-[clamp(1.15rem,1.8vw,1.7rem)] leading-[1.25] font-medium sm:right-10 lg:right-16 lg:max-w-[18rem]">
        United Carriers operates where freight complexity is highest and
        reliability is essential
      </p>

      <h1 className="absolute bottom-8 left-6 z-10 text-[clamp(3.6rem,9.5vw,7.75rem)] leading-none font-bold tracking-[-0.045em] uppercase sm:left-10 lg:bottom-12 lg:left-14">
        Industries
      </h1>
    </section>
  );
}
