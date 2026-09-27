import { ScrollVideo } from "@/components/motion/scroll-video";

export function ScrollVideoShowcase() {
  return (
    <section className="bg-black">
      <ScrollVideo src="/videos/showcase.mp4">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-16">
          <div className="mx-auto w-full max-w-[1440px] px-6 text-white sm:px-10 lg:px-14">
            <p className="text-xs font-medium tracking-[0.2em] text-white/70 uppercase">
              Operations in motion
            </p>
            <h2 className="mt-3 max-w-xl text-3xl leading-[0.95] font-bold tracking-[-0.04em] md:text-5xl">
              Every shipment, tracked from dock to door
            </h2>
          </div>
        </div>
      </ScrollVideo>
    </section>
  );
}
