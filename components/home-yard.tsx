"use client";

import { useScroll } from "motion/react";
import { useEffect, useRef } from "react";

const PIVOT_X = 248;
const PIVOT_Y = 548;
const BOOM_LEN = 700;

function sat(value: number) {
  return Math.min(1, Math.max(0, value));
}

function seg(progress: number, start: number, end: number) {
  return sat((progress - start) / (end - start));
}

function smooth(value: number) {
  return value * value * (3 - 2 * value);
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function BoxRear({
  width,
  height,
  fill,
  door,
}: {
  width: number;
  height: number;
  fill: string;
  door: string;
}) {
  const doorWidth = (width - 18) / 2;
  return (
    <g>
      <rect width={width} height={height} fill={fill} />
      <rect width="9" height="9" fill="#242424" />
      <rect x={width - 9} width="9" height="9" fill="#242424" />
      <rect y={height - 9} width="9" height="9" fill="#242424" />
      <rect x={width - 9} y={height - 9} width="9" height="9" fill="#242424" />
      <rect x="7" y="14" width={doorWidth} height={height - 26} fill={door} />
      <rect
        x={width - 7 - doorWidth}
        y="14"
        width={doorWidth}
        height={height - 26}
        fill={door}
      />
      <rect x={width / 2 - 1} y="14" width="2" height={height - 26} fill="#1a1a1a" opacity="0.35" />
      <rect x="16" y="22" width="3.5" height={height - 42} fill="#6f6d68" />
      <rect x={width - 19.5} y="22" width="3.5" height={height - 42} fill="#6f6d68" />
      <rect x="12" y={height * 0.38} width="12" height="8" rx="1" fill="#3a3a3a" />
      <rect x={width - 24} y={height * 0.38} width="12" height="8" rx="1" fill="#3a3a3a" />
      <rect x="12" y={height * 0.58} width="12" height="8" rx="1" fill="#3a3a3a" />
      <rect x={width - 24} y={height * 0.58} width="12" height="8" rx="1" fill="#3a3a3a" />
    </g>
  );
}

function HazardBar({ width }: { width: number }) {
  const blocks = Math.ceil(width / 16);
  return (
    <g>
      {Array.from({ length: blocks }, (_, index) => (
        <rect
          key={index}
          x={index * 16}
          width="16"
          height="18"
          fill={index % 2 === 0 ? "#f0c400" : "#161616"}
        />
      ))}
    </g>
  );
}

function TireMark({ radius }: { radius: number }) {
  return (
    <g>
      <circle r={radius} fill="#141414" />
      <circle r={radius * 0.62} fill="#2a2a2a" />
      <circle r={radius * 0.2} fill="#d5d5d5" />
      {[0, 60, 120].map((angle) => (
        <rect
          key={angle}
          x="-2"
          y={-radius * 0.52}
          width="4"
          height={radius * 0.28}
          fill="#bdbdbd"
          transform={`rotate(${angle})`}
        />
      ))}
    </g>
  );
}

export function HomeYard() {
  const sectionRef = useRef<HTMLElement>(null);
  const yardRef = useRef<SVGGElement>(null);
  const stackerRef = useRef<SVGGElement>(null);
  const boomRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const heldRef = useRef<SVGGElement>(null);
  const stackedRef = useRef<SVGGElement>(null);
  const truckRef = useRef<SVGGElement>(null);
  const truckBoxRef = useRef<SVGGElement>(null);
  const sideRef = useRef<SVGGElement>(null);
  const overheadRef = useRef<SVGGElement>(null);
  const rigRef = useRef<SVGGElement>(null);
  const cabRef = useRef<SVGGElement>(null);
  const overheadBoxRef = useRef<SVGGElement>(null);
  const speedRef = useRef<HTMLParagraphElement>(null);
  const speedValueRef = useRef<HTMLSpanElement>(null);
  const wheelSpin = useRef({ stacker: 0, truck: 0 });
  const speedState = useRef({ value: 0, lastProgress: 0, lastTime: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const paint = (progress: number) => {
      const enter = smooth(seg(progress, 0, 0.14));
      const lift = smooth(seg(progress, 0.12, 0.34));
      const place = smooth(seg(progress, 0.3, 0.42));
      const rise = smooth(seg(progress, 0.38, 0.5));
      const arrive = smooth(seg(progress, 0.5, 0.66));
      const load = smooth(seg(progress, 0.56, 0.7));
      const drive = smooth(seg(progress, 0.68, 0.86));
      const overhead = smooth(seg(progress, 0.84, 1));

      const boomAngle = lerp(-14, -30, lift) + lerp(0, -14, rise) + lerp(0, 18, load);
      const stackerX = lerp(-720, 20, enter) + lerp(0, 70, arrive);

      stackerRef.current?.setAttribute("transform", `translate(${stackerX} 0)`);
      boomRef.current?.setAttribute(
        "transform",
        `translate(${PIVOT_X} ${PIVOT_Y}) rotate(${boomAngle})`,
      );
      headRef.current?.setAttribute(
        "transform",
        `translate(${BOOM_LEN} 0) rotate(${-boomAngle})`,
      );

      if (heldRef.current) {
        heldRef.current.style.opacity = String(1 - place);
      }
      if (stackedRef.current) {
        stackedRef.current.style.opacity = String(place);
      }

      const yardX = lerp(0, -40, arrive) + lerp(0, -220, drive);
      const yardScale = lerp(1, 0.94, arrive);
      yardRef.current?.setAttribute(
        "transform",
        `translate(${yardX} ${760 * (1 - yardScale)}) scale(${yardScale})`,
      );
      if (yardRef.current) {
        yardRef.current.style.opacity = String(lerp(1, 0.25, drive));
        yardRef.current.style.filter = `blur(${(drive * 5).toFixed(2)}px)`;
      }

      const truckX = lerp(1680, 760, arrive) + lerp(0, -1280, drive);
      truckRef.current?.setAttribute("transform", `translate(${truckX} 28)`);
      truckBoxRef.current?.setAttribute(
        "transform",
        `translate(196 ${lerp(-130, 0, load)})`,
      );
      if (truckBoxRef.current) {
        truckBoxRef.current.style.opacity = String(load);
      }

      const sceneScale = lerp(1, 0.82, drive);
      sideRef.current?.setAttribute(
        "transform",
        `translate(720 780) scale(${sceneScale}) translate(-720 -780)`,
      );
      if (sideRef.current) {
        sideRef.current.style.opacity = String(1 - overhead);
      }

      if (overheadRef.current) {
        overheadRef.current.style.opacity = String(overhead);
      }

      const turn = smooth(seg(progress, 0.86, 1));
      rigRef.current?.setAttribute(
        "transform",
        `translate(720 430) rotate(${lerp(-62, 0, turn)})`,
      );
      cabRef.current?.setAttribute("transform", `rotate(${lerp(10, 0, turn)})`);
      overheadBoxRef.current?.setAttribute(
        "transform",
        `translate(118 18) rotate(${lerp(-16, 0, turn)})`,
      );

      wheelSpin.current.stacker = enter * 280 + lift * 40;
      wheelSpin.current.truck = arrive * 220 + drive * 1100;
      root.querySelectorAll<SVGGElement>("[data-wheel]").forEach((wheel) => {
        const x = wheel.dataset.x;
        const y = wheel.dataset.y;
        const spin =
          wheel.dataset.wheel === "truck"
            ? wheelSpin.current.truck
            : wheelSpin.current.stacker;
        wheel.setAttribute("transform", `translate(${x} ${y}) rotate(${spin})`);
      });

      const now = performance.now();
      const previous = speedState.current;
      const delta = Math.max(0.016, (now - previous.lastTime) / 1000);
      const velocity = Math.abs(progress - previous.lastProgress) / delta;
      const moving = drive > 0.08 && overhead < 0.75;
      const target = moving ? Math.min(92, velocity * 38) : 0;
      previous.value += (target - previous.value) * (target > previous.value ? 0.18 : 0.08);
      if (previous.value < 0.4 && target === 0) previous.value = 0;
      previous.lastProgress = progress;
      previous.lastTime = now;

      if (speedValueRef.current) {
        speedValueRef.current.textContent = Math.round(previous.value)
          .toString()
          .padStart(2, "0");
      }
      if (speedRef.current) {
        const shown = sat(drive * 3) * (1 - overhead);
        speedRef.current.style.transform = `translateY(${(1 - shown) * 120}%)`;
      }
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    paint(reduced ? 0.48 : scrollYProgress.get());
    if (reduced) return;

    const unsubscribe = scrollYProgress.on("change", paint);
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      className="yard-track relative h-[420vh] bg-white text-neutral-950"
      aria-label="Dockyard loading sequence"
    >
      <p className="sr-only">
        Scrolling plays a reach stacker lifting a container onto a yard stack, a
        truck arriving to be loaded, the truck driving out, then an overhead view
        of the container lining up on the trailer.
      </p>
      <div className="yard-stage sticky top-0 h-svh overflow-hidden bg-white">
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 1440 820"
            preserveAspectRatio="xMidYMax meet"
            className="h-full w-full"
            aria-hidden
          >
            <g ref={sideRef}>
              <g ref={yardRef}>
                <ellipse cx="1040" cy="772" rx="250" ry="12" fill="#000" opacity="0.06" />
                <g transform="translate(930 568)">
                  <BoxRear width="176" height="196" fill="#243f78" door="#2c4b8c" />
                </g>
                <g transform="translate(1122 586)">
                  <BoxRear width="164" height="178" fill="#ef6c24" door="#f47a36" />
                </g>
                <g ref={stackedRef} opacity="0" transform="translate(930 372)">
                  <BoxRear width="176" height="196" fill="#e6e2da" door="#f6f3ed" />
                </g>

                <g ref={stackerRef} transform="translate(-720 0)">
                  <ellipse cx="300" cy="774" rx="230" ry="14" fill="#000" opacity="0.08" />
                  <path
                    fill="#14b6d8"
                    d="M78 752 L78 648 C78 592 118 552 176 538 L250 522 L318 512 L430 522 L468 590 L486 700 L468 752 Z"
                  />
                  <path fill="#0c96b4" d="M78 640 H168 V752 H78 Z" />
                  <path fill="#18c0e2" d="M214 518 L214 412 L318 398 L368 414 L368 522 Z" />
                  <path fill="#102830" d="M230 496 L230 434 L308 424 L348 434 L348 496 Z" />
                  <path fill="#8fe0ee" opacity="0.45" d="M240 468 L240 444 L286 438 L286 468 Z" />
                  <path d="M318 404 V514" stroke="#0b7c96" strokeWidth="3" />
                  <rect x="186" y="620" width="26" height="7" fill="#0b7c96" />
                  <rect x="186" y="646" width="26" height="7" fill="#0b7c96" />
                  <rect x="430" y="600" width="18" height="46" rx="2" fill="#0e8eaa" />

                  <g data-wheel="stacker" data-x="150" data-y="706">
                    <TireMark radius="52" />
                  </g>
                  <g data-wheel="stacker" data-x="392" data-y="692">
                    <TireMark radius="64" />
                  </g>

                  <g
                    ref={boomRef}
                    transform={`translate(${PIVOT_X} ${PIVOT_Y}) rotate(-14)`}
                  >
                    <path
                      d={`M-10 -26 L${BOOM_LEN - 20} -12 L${BOOM_LEN - 8} 8 L-6 34 Z`}
                      fill="#1b1d21"
                    />
                    <path
                      d={`M30 -6 L${BOOM_LEN - 70} -1`}
                      stroke="#3c4046"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <rect x="46" y="18" width="280" height="10" rx="5" fill="#5a5e64" />
                    <rect x="46" y="21" width="150" height="5" rx="2" fill="#8b9096" />
                    <g ref={headRef} transform={`translate(${BOOM_LEN} 0) rotate(14)`}>
                      <rect x="-16" y="-18" width="34" height="30" rx="3" fill="#1b1d21" />
                      <g transform="translate(-86 16)">
                        <HazardBar width="172" />
                        <rect x="18" y="18" width="7" height="16" fill="#222" />
                        <rect x="146" y="18" width="7" height="16" fill="#222" />
                      </g>
                      <g ref={heldRef} transform="translate(-88 50)">
                        <BoxRear width="176" height="196" fill="#e6e2da" door="#f6f3ed" />
                      </g>
                    </g>
                  </g>
                </g>
              </g>

              <g ref={truckRef} transform="translate(1680 28)">
                <ellipse cx="420" cy="746" rx="300" ry="12" fill="#000" opacity="0.07" />
                <path
                  fill="#161616"
                  d="M18 620 L18 500 L70 470 L168 458 L196 500 L196 690 L40 700 Z"
                />
                <path fill="#2a2a2a" d="M36 560 L36 492 L150 478 L178 500 L178 560 Z" />
                <path fill="#9fd7e4" opacity="0.55" d="M48 530 L48 502 L110 494 L110 530 Z" />
                <rect x="168" y="668" width="620" height="22" fill="#2a2a2a" />
                <rect x="190" y="650" width="560" height="18" fill="#3a3a3a" />
                <g ref={truckBoxRef} transform="translate(196 -130)" opacity="0">
                  <rect width="520" height="168" fill="#f3f1eb" />
                  <rect y="150" width="520" height="18" fill="#dedad2" />
                  {Array.from({ length: 18 }, (_, index) => (
                    <rect
                      key={index}
                      x={16 + index * 28}
                      y="10"
                      width="8"
                      height="132"
                      fill="#e4e0d8"
                    />
                  ))}
                  <rect width="10" height="10" fill="#242424" />
                  <rect x="510" width="10" height="10" fill="#242424" />
                  <rect y="158" width="10" height="10" fill="#242424" />
                  <rect x="510" y="158" width="10" height="10" fill="#242424" />
                </g>
                <g data-wheel="truck" data-x="92" data-y="700">
                  <TireMark radius="46" />
                </g>
                <g data-wheel="truck" data-x="250" data-y="708">
                  <TireMark radius="40" />
                </g>
                <g data-wheel="truck" data-x="340" data-y="708">
                  <TireMark radius="40" />
                </g>
                <g data-wheel="truck" data-x="560" data-y="708">
                  <TireMark radius="40" />
                </g>
                <g data-wheel="truck" data-x="650" data-y="708">
                  <TireMark radius="40" />
                </g>
              </g>
            </g>

            <g ref={overheadRef} opacity="0">
              <rect width="1440" height="820" fill="#f7f7f5" />
              <g opacity="0.9">
                <g transform="translate(180 150)">
                  <BoxRear width="120" height="132" fill="#243f78" door="#2c4b8c" />
                </g>
                <g transform="translate(312 150)">
                  <BoxRear width="120" height="132" fill="#e6e2da" door="#f6f3ed" />
                </g>
                <g transform="translate(180 294)">
                  <BoxRear width="120" height="132" fill="#ef6c24" door="#f47a36" />
                </g>
              </g>
              <rect x="0" y="500" width="1440" height="150" fill="#141414" />
              <g stroke="#f5c400" strokeWidth="6" strokeDasharray="28 22">
                <line x1="0" y1="575" x2="1440" y2="575" />
              </g>
              <g ref={rigRef} transform="translate(720 430) rotate(-62)">
                <g ref={cabRef}>
                  <rect x="-70" y="-36" width="150" height="92" rx="10" fill="#1a1a1a" />
                  <rect x="-58" y="-24" width="46" height="68" rx="4" fill="#314048" />
                  <rect x="8" y="-22" width="58" height="64" fill="#111" />
                </g>
                <g ref={overheadBoxRef} transform="translate(118 18) rotate(-16)">
                  <rect width="360" height="78" fill="#e7e3db" />
                  {Array.from({ length: 12 }, (_, index) => (
                    <rect
                      key={index}
                      x={10 + index * 29}
                      y="8"
                      width="8"
                      height="62"
                      fill="#d9d4cb"
                    />
                  ))}
                  <rect width="8" height="8" fill="#222" />
                  <rect x="352" width="8" height="8" fill="#222" />
                  <rect y="70" width="8" height="8" fill="#222" />
                  <rect x="352" y="70" width="8" height="8" fill="#222" />
                </g>
              </g>
            </g>
          </svg>
        </div>

        <p
          ref={speedRef}
          className="absolute bottom-6 left-6 flex items-baseline gap-2 font-mono text-[12px] tracking-[0.18em] text-neutral-950 uppercase sm:left-10"
          style={{ transform: "translateY(120%)" }}
          aria-hidden
        >
          <span ref={speedValueRef}>00</span>
          <span>km/h</span>
        </p>
      </div>
    </section>
  );
}
