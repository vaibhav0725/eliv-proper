"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ScrollVideoProps = {
  src: string;
  className?: string;
  /** How many viewport-heights of scroll it takes to play through the whole clip. */
  scrollLengthVh?: number;
  children?: ReactNode;
};

export function ScrollVideo({
  src,
  className,
  scrollLengthVh = 400,
  children,
}: ScrollVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    video.pause();
    video.preload = "auto";

    let st: ScrollTrigger | null = null;
    let raf = 0;
    let targetTime = 0;
    let playhead = 0;
    let running = true;

    const prime = () => {
      const play = video.play();
      if (play) {
        play
          .then(() => {
            video.pause();
          })
          .catch(() => {});
      }
    };

    const tick = () => {
      if (!running) return;

      const duration = video.duration || 0;
      if (duration && video.readyState >= 2 && !video.seeking) {
        playhead += (targetTime - playhead) * 0.18;
        if (Math.abs(targetTime - playhead) < 0.01) playhead = targetTime;

        const next = Math.min(Math.max(playhead, 0), Math.max(duration - 0.04, 0));
        if (Math.abs(video.currentTime - next) > 0.012) {
          video.currentTime = next;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    const setup = () => {
      const duration = video.duration || 0;
      if (!duration) return;

      if (reduceMotion) {
        video.currentTime = duration * 0.5;
        return;
      }

      prime();
      playhead = video.currentTime || 0;
      targetTime = playhead;
      raf = requestAnimationFrame(tick);

      st = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.35,
        onUpdate: (self) => {
          const target = self.progress * duration;
          if (Number.isFinite(target)) targetTime = target;
        },
      });
    };

    if (video.readyState >= 1) setup();
    else video.addEventListener("loadedmetadata", setup, { once: true });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", setup);
      st?.kill();
    };
  }, [src]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ height: `${scrollLengthVh}vh` }}
    >
      <div className="relative sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src={`${src}?v=iframe`}
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
        {children}
      </div>
    </div>
  );
}
