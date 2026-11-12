"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS as FILM_CHAPTERS, ROAD_START } from "@/lib/journey/chapters";

gsap.registerPlugin(ScrollTrigger);

/** Live-action opening: the courier loads the truck. Scrubbed by scroll, then dissolves into the 3D film. */
const INTRO_FRAMES = 214;
const introUrl = (i: number) => `/journey/intro/${String(i).padStart(3, "0")}.avif`;
/** Scroll length of the opening, in viewport heights, and of the dissolve into 3D that overlaps its end. */
const INTRO_VH = 300;
const FADE_VH = 45;

/** Shipment clock: morning at the loading dock, dusk falls on the highway. */
const INTRO_CLOCK: [number, number] = [7 * 60 + 5, 8 * 60 + 35];
const CLOCK: [number, number][] = [
  [ROAD_START, 8 * 60 + 40],
  [69.5, 17 * 60 + 30],
  [81.5, 19 * 60 + 45],
  [118, 23 * 60 + 10],
];

const fmtClock = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(Math.floor(m) % 60).padStart(2, "0")}`;

function clockAt(t: number) {
  let m = CLOCK[CLOCK.length - 1][1];
  for (let i = 1; i < CLOCK.length; i++) {
    const [t0, m0] = CLOCK[i - 1];
    const [t1, m1] = CLOCK[i];
    if (t <= t1) {
      m = m0 + ((Math.max(t, t0) - t0) / (t1 - t0)) * (m1 - m0);
      break;
    }
  }
  return fmtClock(m);
}

const CHAPTER_COPY = [
  {
    key: "pickup",
    eyebrow: "01 — Pickup",
    title: "Handed over at the door.",
    body: "Our courier takes your consignment from the door and walks it straight to the truck. From the first touch it is on one file, with one team.",
  },
  {
    key: "load",
    eyebrow: "02 — Load",
    title: "Loaded on the same file.",
    body: "Packed, counted and sealed by our own team, so what leaves the dock is exactly what you booked.",
  },
  {
    key: "road",
    eyebrow: "03 — Road",
    title: "Every leg of the journey.",
    body: "Local, metro and interstate legs run on live tracking. You see the truck the way our dispatch team does.",
  },
  {
    key: "port",
    eyebrow: "04 — Port",
    title: "Quay to vessel, no gaps.",
    body: "Terminal slots, customs release and stevedoring are coordinated in-house, so your box makes the cut-off.",
  },
  {
    key: "sea",
    eyebrow: "05 — Sea",
    title: "Across APAC, tracked to the door.",
    body: "Australia, New Zealand, Hong Kong and China. One operator from the yard gate to the final mile.",
  },
];

const PORT_AT = FILM_CHAPTERS.find((c) => c.key === "port")!.at;
const SEA_AT = FILM_CHAPTERS.find((c) => c.key === "sea")!.at;

const smooth = (x: number, a: number, b: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Draws the opening clip, frame by frame, onto a canvas (cover-fit).
 *
 * Decoding every full-size frame at once would be hundreds of MB of bitmaps, which the browser
 * evicts and re-decodes on the main thread while you scrub — that is what makes scrubbing
 * stutter. So the compressed frames are fetched up front (6.7 MB), and only a small window
 * around the playhead is decoded off-thread into ImageBitmaps; everything else stays compressed.
 */
function createFramePlayer(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d", { alpha: false })!;
  ctx.imageSmoothingQuality = "medium";
  const blobs: (Blob | null)[] = new Array(INTRO_FRAMES).fill(null);
  const bitmaps = new Map<number, ImageBitmap>();
  const pending = new Set<number>();
  const BEHIND = 6;
  const AHEAD = 28;
  let fetchNext = 0;
  let fetching = 0;
  let decoding = 0;
  let stopped = false;
  let wanted = 0;
  let dir = 1;
  let lastDrawn = -1;

  const closest = (idx: number) => {
    for (let d = 0; d < 80; d++) {
      if (bitmaps.has(idx - d)) return idx - d;
      if (bitmaps.has(idx + d)) return idx + d;
    }
    return -1;
  };

  const decodeWindow = () => {
    if (stopped) return;
    const lo = Math.max(0, wanted - (dir > 0 ? BEHIND : AHEAD));
    const hi = Math.min(INTRO_FRAMES - 1, wanted + (dir > 0 ? AHEAD : BEHIND));
    for (const [i, bm] of bitmaps) {
      if (i < lo - 4 || i > hi + 4) {
        bm.close();
        bitmaps.delete(i);
      }
    }
    const order: number[] = [];
    for (let i = lo; i <= hi; i++) order.push(i);
    order.sort((x, y) => Math.abs(x - wanted) - Math.abs(y - wanted));
    for (const i of order) {
      if (decoding >= 3) break;
      const blob = blobs[i];
      if (!blob || bitmaps.has(i) || pending.has(i)) continue;
      pending.add(i);
      decoding++;
      createImageBitmap(blob)
        .then((bm) => {
          if (stopped || i < wanted - AHEAD - 4 || i > wanted + AHEAD + 4) bm.close();
          else bitmaps.set(i, bm);
        })
        .catch(() => {})
        .finally(() => {
          pending.delete(i);
          decoding--;
          decodeWindow();
        });
    }
  };

  const fetchPump = () => {
    while (!stopped && fetching < 6 && fetchNext < INTRO_FRAMES) {
      const i = fetchNext++;
      fetching++;
      fetch(introUrl(i))
        .then((r) => r.blob())
        .then((b) => {
          blobs[i] = b;
          decodeWindow();
        })
        .catch(() => {})
        .finally(() => {
          fetching--;
          fetchPump();
        });
    }
  };
  fetchPump();

  const resize = (w: number, h: number) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.15);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    lastDrawn = -1;
  };

  /** vp: 0..1 through the clip */
  const draw = (vp: number) => {
    const idx = Math.round(Math.min(1, Math.max(0, vp)) * (INTRO_FRAMES - 1));
    if (idx !== wanted) {
      dir = idx > wanted ? 1 : -1;
      wanted = idx;
      decodeWindow();
    }
    const j = closest(idx);
    if (j < 0 || j === lastDrawn) return;
    const bm = bitmaps.get(j)!;
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / bm.width, ch / bm.height);
    const sw = cw / scale;
    const sh = ch / scale;
    // biased left so the subject sits right of the copy column
    ctx.drawImage(bm, (bm.width - sw) * 0.2, (bm.height - sh) * 0.5, sw, sh, 0, 0, cw, ch);
    lastDrawn = j;
  };

  return {
    draw,
    resize,
    stop: () => {
      stopped = true;
      for (const bm of bitmaps.values()) bm.close();
      bitmaps.clear();
    },
  };
}

/**
 * Scroll-driven logistics film. It opens on live-action footage (the courier
 * carries a parcel to the ELIV truck, loads it and seals the doors), which
 * dissolves into the 3D film as the truck pulls out for the dockyard:
 * road (day turns to night) → quay crane → vessel. The section is tall; its
 * stage is `position: sticky`, so there is no pin-spacer reflow.
 */
export function JourneyShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLCanvasElement>(null);
  const speedRef = useRef<HTMLSpanElement>(null);
  const unitRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dayScrimRef = useRef<HTMLDivElement>(null);
  const nightScrimRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current!;
    const stage = stageRef.current!;
    const player = createFramePlayer(introRef.current!);

    let disposed = false;
    let three: null | {
      scene: import("@/lib/journey/scene").JourneyScene;
      state: import("@/lib/journey/scene").JourneyState;
      tl: gsap.core.Timeline;
      total: number;
    } = null;
    let cleanup3d = () => {};

    // ---- geometry: how much of the scroll belongs to the clip ----
    let vEnd = 0.28;
    let fade = 0.04;
    const geometry = () => {
      const vh = window.innerHeight;
      const len = Math.max(1, section.offsetHeight - vh);
      vEnd = Math.min(0.9, ((INTRO_VH / 100) * vh) / len);
      fade = Math.min(vEnd, ((FADE_VH / 100) * vh) / len);
    };
    const resize = () => {
      geometry();
      player.resize(stage.clientWidth, stage.clientHeight);
      three?.scene.resize(stage.clientWidth, stage.clientHeight);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    // ---- scroll ----
    let target = 0;
    let current = 0;
    let visible = true;
    let activeChapter = -1;
    let isNight = false;
    let lastNight = -1;
    let debugOverride: Record<string, number> | null = null;
    // last values written to the DOM, so unchanged frames cost nothing
    let wClock = "";
    let wSpeed = "";
    let wUnit = "";
    let wBar = -1;
    let wIntro = -1;
    let wSeam = -1;
    // adaptive resolution for the 3D film
    let slow = 0;
    let fast = 0;
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => (target = self.progress),
    });
    target = current = st.progress;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "200px 0px" });
    io.observe(section);

    const frame = (time: number, deltaMs: number) => {
      if (!visible) return;
      // while the section slides in under the black hero, a dark band hides the seam between them
      if (seamRef.current) {
        const top = st.start - window.scrollY; // no layout read
        const o = Math.round(Math.min(1, Math.max(0, top / window.innerHeight)) ** 0.6 * 100) / 100;
        if (o !== wSeam) {
          wSeam = o;
          seamRef.current.style.opacity = String(o);
        }
      }
      // critically-damped follow: no jumps on wheel ticks or scrollbar drags. Tight during the clip so
      // the picture stays locked to the scroll, a little softer for the 3D camera moves.
      const rate = current < vEnd ? 16 : 9;
      const k = 1 - Math.exp(-(Math.min(deltaMs, 100) / 1000) * rate);
      current += (target - current) * k;
      if (Math.abs(target - current) < 1e-5) current = target;
      const p = current;

      // ---- live-action opening ----
      const vp = Math.min(1, p / vEnd);
      // the clip's last frame holds until the 3D film has loaded, so there is never a blank gap
      const introOpacity = three ? 1 - smooth(p, vEnd - fade, vEnd) : 1;
      if (introOpacity > 0.001) player.draw(vp);
      const io100 = Math.round(introOpacity * 200) / 200;
      if (introRef.current && io100 !== wIntro) {
        wIntro = io100;
        introRef.current.style.opacity = String(io100);
        introRef.current.style.visibility = io100 <= 0 ? "hidden" : "visible";
      }

      // ---- 3D film: only drawn once it starts to show through ----
      let t = ROAD_START;
      let night = 0;
      let speed = 4;
      let unit = "KM/H";
      let mode = 0;
      if (three && introOpacity < 0.999) {
        const { scene, state, tl, total } = three;
        t = ROAD_START + Math.min(1, Math.max(0, (p - vEnd) / (1 - vEnd))) * (total - ROAD_START);
        tl.time(t);
        if (debugOverride) Object.assign(state, debugOverride);
        scene.update(state, t);
        scene.tick(time);
        scene.render();
        // keep it smooth: drop resolution when frames run long, win it back when there is headroom
        if (!debug) {
          if (deltaMs > 24) {
            slow++;
            fast = 0;
          } else if (deltaMs < 15) {
            fast++;
            slow = 0;
          } else {
            slow = 0;
            fast = 0;
          }
          if (slow >= 12) {
            scene.setPixelRatio(scene.pixelRatio - 0.15);
            slow = 0;
          } else if (fast >= 90) {
            scene.setPixelRatio(scene.pixelRatio + 0.1);
            fast = 0;
          }
        }
        night = state.night;
        speed = scene.speed;
        mode = state.mode;
      }
      if (mode >= 4) unit = "KN";

      // HUD — written straight to the DOM, no React renders per frame
      let ch: number;
      if (p < vEnd * 0.5) ch = 0;
      else if (p < vEnd) ch = 1;
      else ch = t >= SEA_AT ? 4 : t >= PORT_AT ? 3 : 2;
      if (ch !== activeChapter) {
        activeChapter = ch;
        chapterRefs.current.forEach((el, i) => el?.toggleAttribute("data-active", i === ch));
        railRefs.current.forEach((el, i) => {
          el?.toggleAttribute("data-active", i === ch);
          el?.toggleAttribute("data-done", i < ch);
        });
      }
      const speedTxt = String(Math.min(99, Math.round(p < vEnd ? 4 : speed))).padStart(2, "0");
      if (speedRef.current && speedTxt !== wSpeed) {
        wSpeed = speedTxt;
        speedRef.current.textContent = speedTxt;
      }
      if (unitRef.current && unit !== wUnit) {
        wUnit = unit;
        unitRef.current.textContent = unit;
      }
      const bar = Math.round(p * 2000) / 2000;
      if (barRef.current && bar !== wBar) {
        wBar = bar;
        barRef.current.style.transform = `scaleX(${bar})`;
      }
      const clockTxt = p < vEnd ? fmtClock(INTRO_CLOCK[0] + vp * (INTRO_CLOCK[1] - INTRO_CLOCK[0])) : clockAt(t);
      if (clockRef.current && clockTxt !== wClock) {
        wClock = clockTxt;
        clockRef.current.textContent = clockTxt;
      }

      // the day passes, morning to night, and the overlay follows the light
      if (Math.abs(night - lastNight) > 1e-3) {
        lastNight = night;
        if (dayScrimRef.current) dayScrimRef.current.style.opacity = String(1 - night);
        if (nightScrimRef.current) nightScrimRef.current.style.opacity = String(night);
        if (night > 0.5 !== isNight) {
          isNight = night > 0.5;
          stage.toggleAttribute("data-night", isNight);
        }
      }
    };

    // `?journey-debug` freezes the loop and exposes a manual seek — used for visual QA screenshots
    const debug = new URLSearchParams(window.location.search).has("journey-debug");
    if (debug) {
      (window as unknown as { __journeySeek?: (p: number, o?: Record<string, number>) => void }).__journeySeek = (p, o) => {
        debugOverride = o ?? null;
        target = current = p;
        visible = true;
        frame(gsap.ticker.time, 16);
      };
    } else gsap.ticker.add(frame);
    frame(gsap.ticker.time, 1000);

    // ---- 3D film, built in the background once the browser is idle (never during first paint or while scrubbing) ----
    const build = async () => {
      const [{ JourneyScene }, { buildTimeline }] = await Promise.all([import("@/lib/journey/scene"), import("@/lib/journey/timeline")]);
      if (disposed || !canvasRef.current) return;
      let scene: InstanceType<typeof JourneyScene>;
      try {
        scene = new JourneyScene(canvasRef.current, { mobile: window.matchMedia("(max-width: 767px)").matches });
      } catch {
        setFailed(true);
        return;
      }
      const state = scene.initialState();
      const tl = buildTimeline(scene, state);
      three = { scene, state, tl, total: tl.duration() };
      scene.resize(stage.clientWidth, stage.clientHeight);
      cleanup3d = () => {
        tl.kill();
        scene.dispose();
      };
      frame(gsap.ticker.time, 1000);
      setReady(true);
    };
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (h: number) => void };
    const idleHandle = w.requestIdleCallback ? w.requestIdleCallback(() => void build(), { timeout: 2500 }) : window.setTimeout(() => void build(), 800);

    return () => {
      disposed = true;
      if (w.cancelIdleCallback) w.cancelIdleCallback(idleHandle);
      else window.clearTimeout(idleHandle);
      gsap.ticker.remove(frame);
      st.kill();
      io.disconnect();
      ro.disconnect();
      player.stop();
      cleanup3d();
    };
  }, []);

  return (
    <section ref={sectionRef} id="journey" aria-label="From the loading dock to the vessel" className="relative h-[1000vh] bg-[#070d1b] md:h-[1150vh]">
      <div ref={stageRef} className="journey-stage sticky top-0 h-[100svh] w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
          aria-hidden
        />
        {/* live-action opening, drawn frame by frame; dissolves away as the 3D film shows through */}
        <canvas ref={introRef} className="absolute inset-0 z-[1] h-full w-full" aria-hidden />
        {failed && (
          <div className="absolute inset-0 bg-[#0d0e12]" aria-hidden />
        )}

        {/* soft scrim keeps copy legible over the 3D stage */}
        <div ref={dayScrimRef} style={{ opacity: 1 }} className="pointer-events-none absolute inset-0 z-[5] bg-[linear-gradient(to_top,rgba(238,240,243,0.95)_0%,rgba(238,240,243,0.6)_30%,transparent_55%)] md:bg-[linear-gradient(to_right,rgba(238,240,243,0.92)_0%,rgba(238,240,243,0.55)_30%,transparent_48%)]" />
        <div ref={nightScrimRef} style={{ opacity: 0 }} className="pointer-events-none absolute inset-0 z-[5] bg-[linear-gradient(to_top,rgba(7,13,27,0.92)_0%,rgba(7,13,27,0.55)_30%,transparent_55%)] md:bg-[linear-gradient(to_right,rgba(7,13,27,0.85)_0%,rgba(7,13,27,0.45)_30%,transparent_48%)]" />

        {/* chapter copy */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-24 sm:px-8 md:inset-y-0 md:left-0 md:right-auto md:flex md:w-[44vw] md:max-w-[560px] md:items-center md:pb-0 md:pl-12">
          <div className="relative h-[190px] w-full md:h-[260px]">
            {CHAPTER_COPY.map((c, i) => (
              <div
                key={c.key}
                ref={(el) => {
                  chapterRefs.current[i] = el;
                }}
                className="journey-chapter absolute inset-0"
              >
                <p className="j-muted font-mono text-[11px] tracking-[0.22em] uppercase">{c.eyebrow}</p>
                <h3 className="mt-3 text-[34px] leading-[0.98] font-semibold tracking-[-0.03em] j-ink sm:text-5xl md:text-[58px]">
                  {c.title}
                </h3>
                <p className="mt-4 max-w-[400px] text-[14px] leading-relaxed j-body md:text-[15px]">{c.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* speedometer, like a dash readout */}
        <div className="j-muted pointer-events-none absolute top-24 left-5 z-10 font-mono text-[11px] tracking-[0.2em] sm:left-8 md:left-12">
          <span ref={clockRef} className="j-ink tabular-nums">07:05</span>
          <span className="mx-2 opacity-50">·</span>
          <span ref={speedRef} className="j-ink tabular-nums">04</span> <span ref={unitRef}>KM/H</span>
        </div>

        {/* chapter rail */}
        <ol className="pointer-events-none absolute top-24 right-5 z-10 hidden flex-col items-end gap-3 font-mono text-[10px] tracking-[0.22em] uppercase sm:right-8 md:flex md:right-12">
          {CHAPTER_COPY.map((c, i) => (
            <li
              key={c.key}
              ref={(el) => {
                railRefs.current[i] = el;
              }}
              className="journey-rail flex items-center gap-3"
            >
              {c.eyebrow.split(" — ")[1]}
              <span className="block h-px w-6 bg-current" />
            </li>
          ))}
        </ol>

        <div ref={seamRef} className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[38vh] bg-gradient-to-b from-black via-black/60 to-transparent" aria-hidden />

        <div className="absolute inset-x-0 bottom-0 z-10 h-[3px] bg-black/5">
          <div ref={barRef} className="h-full origin-left bg-[#1d55d6]" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
