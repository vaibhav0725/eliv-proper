import Image from "next/image";

export function CareersHero() {
  return (
    <section className="relative h-svh min-h-[560px] overflow-hidden bg-black text-white">
      <Image
        src="/careers-hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/30" />

      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-10 sm:px-10 lg:px-14 lg:pb-14">
        <h1 className="text-[clamp(3.4rem,8.5vw,7.25rem)] leading-[0.88] font-bold tracking-[-0.045em] uppercase">
          Join
          <br />
          our team
        </h1>
        <p className="mt-6 max-w-md text-sm leading-6 text-white/90 sm:text-[15px]">
          We empower people to power business. Growing fast across APAC, we’re
          looking for driven individuals who value impact and accountability.
        </p>
      </div>
    </section>
  );
}
