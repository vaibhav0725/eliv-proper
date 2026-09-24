import Image from "next/image";
import Link from "next/link";

export function HomeIntro() {
  return (
    <section className="bg-white text-neutral-950">
      <div className="mx-auto grid w-full max-w-[1440px] items-end gap-12 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:px-14 lg:py-24">
        <h2 className="text-[clamp(2.8rem,6vw,5.4rem)] leading-[0.86] font-bold tracking-[-0.045em] uppercase">
          We move
          <br />
          freight.
          <br />
          We own
          <br />
          the outcome.
        </h2>
        <div>
          <p className="max-w-md text-sm leading-6 text-zinc-600">
            With every service under one roof and one accountable team, your
            supply chain moves the way your business demands: predictably,
            transparently, and without excuses.
          </p>
          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-600">
            That means no finger-pointing between vendors. No delays lost in
            handoffs. Just one team, accountable from origin to destination.
          </p>
          <Link
            href="/about"
            className="mt-8 inline-flex h-11 items-center rounded-full bg-neutral-950 px-5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase"
          >
            Learn more about us
          </Link>
        </div>
      </div>
      <div className="relative mx-auto aspect-[16/7] w-full max-w-[1440px] overflow-hidden px-6 sm:px-10 lg:px-14">
        <div className="relative h-full min-h-64 overflow-hidden">
          <Image
            src="/about/port.jpg"
            alt="Cargo ship at a port"
            fill
            sizes="(min-width: 1440px) 1328px, 100vw"
            className="object-cover"
          />
          <p className="absolute bottom-6 left-6 max-w-xs text-sm leading-6 text-white">
            From countless journeys, clarity emerges
          </p>
        </div>
      </div>
    </section>
  );
}
