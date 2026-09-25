"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

const places = [
  { id: "uk", name: "UK", location: [51.5, -0.12] as [number, number] },
  { id: "germany", name: "Germany", location: [51.16, 10.45] as [number, number] },
  { id: "spain", name: "Spain", location: [40.4, -3.7] as [number, number] },
  { id: "italy", name: "Italy", location: [41.9, 12.5] as [number, number] },
  { id: "turkey", name: "Turkey", location: [39.9, 32.8] as [number, number] },
  { id: "uae", name: "UAE", location: [25.2, 55.27] as [number, number] },
  { id: "qatar", name: "Qatar", location: [25.28, 51.53] as [number, number] },
  { id: "kenya", name: "Kenya", location: [-1.29, 36.82] as [number, number] },
  { id: "south-africa", name: "South Africa", location: [-33.92, 18.42] as [number, number] },
  { id: "usa", name: "USA", location: [40.71, -74] as [number, number] },
  { id: "canada", name: "Canada", location: [43.65, -79.38] as [number, number] },
  { id: "mexico", name: "Mexico", location: [19.43, -99.13] as [number, number] },
  { id: "brazil", name: "Brazil", location: [-23.55, -46.63] as [number, number] },
  { id: "japan", name: "Japan", location: [35.68, 139.69] as [number, number] },
  { id: "hong-kong", name: "Hong Kong", location: [22.32, 114.17] as [number, number] },
  { id: "singapore", name: "Singapore", location: [1.35, 103.82] as [number, number] },
  { id: "australia", name: "Australia", location: [-37.81, 144.96] as [number, number] },
  { id: "new-zealand", name: "New Zealand", location: [-36.85, 174.76] as [number, number] },
  { id: "china", name: "China", location: [22.54, 114.06] as [number, number] },
  { id: "thailand", name: "Thailand", location: [13.75, 100.5] as [number, number] },
];

function isFacing(lat: number, lng: number, phi: number, tilt: number) {
  const latR = (lat * Math.PI) / 180;
  const lngR = (lng * Math.PI) / 180 - Math.PI;
  const cosLat = Math.cos(latR);
  const x = -cosLat * Math.sin(lngR);
  const y = Math.sin(latR);
  const z = cosLat * Math.cos(lngR);
  const cosTheta = Math.cos(tilt);
  const sinTheta = Math.sin(tilt);
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  const facing = -sinPhi * cosTheta * x + sinTheta * y + cosPhi * cosTheta * z;
  return facing > 0.15;
}

const vehicles: Record<string, "plane" | "boat"> = {
  uk: "plane",
  germany: "plane",
  spain: "plane",
  usa: "plane",
  japan: "plane",
  "hong-kong": "plane",
  australia: "boat",
  "new-zealand": "boat",
  china: "boat",
  singapore: "boat",
};

function VehicleIcon({ type }: { type: "plane" | "boat" }) {
  if (type === "plane") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-[#f97316]">
        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-[#f97316]">
      <path d="M3 17.5 5.2 13H2l2-3h4.2L12 4l3.8 6H20l2 3h-3.2L21 17.5 12 15.2 3 17.5z" />
      <path d="M4 19.2h16v1.6H4z" />
    </svg>
  );
}

const arc = [0.98, 0.42, 0.12] as [number, number, number];

const arcs = [
  { from: places[16].location, to: places[18].location },
  { from: places[16].location, to: places[17].location },
  { from: places[18].location, to: places[14].location },
  { from: places[14].location, to: places[15].location },
  { from: places[1].location, to: places[2].location },
  { from: places[9].location, to: places[0].location },
  { from: places[15].location, to: places[16].location },
  { from: places[13].location, to: places[18].location },
].map((route, index) => ({ ...route, id: `arc-${index}`, color: arc }));

export function HomeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labels = useRef<Record<string, HTMLSpanElement | null>>({});
  const icons = useRef<Record<string, HTMLSpanElement | null>>({});
  const pointer = useRef<{ x: number; y: number; phi: number; tilt: number } | null>(null);
  const phiOffset = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let phi = 3.8;
    let tilt = 0.22;
    let frame = 0;
    let width = canvas.offsetWidth;

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: width * 2,
      height: width * 2,
      phi,
      theta: tilt,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 14000,
      mapBrightness: 8,
      baseColor: [0.08, 0.16, 0.45],
      markerColor: [1, 1, 1],
      glowColor: [0.2, 0.45, 1],
      markerElevation: 0.01,
      arcColor: arc,
      arcWidth: 0.8,
      arcHeight: 0.28,
      markers: places.map((place) => ({
        id: place.id,
        location: place.location,
        size: vehicles[place.id] ? 0 : 0.025,
      })),
      arcs,
    });

    const paint = () => {
      if (!dragging.current && !reduce) phi += 0.003;
      const currentPhi = phi + phiOffset.current;
      globe.update({
        phi: currentPhi,
        theta: tilt,
        width: width * 2,
        height: width * 2,
      });
      for (const place of places) {
        const label = labels.current[place.id];
        if (!label) continue;
        const visible = isFacing(place.location[0], place.location[1], currentPhi, tilt);
        label.hidden = !visible;
        const icon = icons.current[place.id];
        if (icon) icon.hidden = !visible;
      }
      frame = requestAnimationFrame(paint);
    };
    frame = requestAnimationFrame(paint);

    const onResize = () => {
      width = canvas.offsetWidth;
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(canvas);

    const onPointerDown = (event: PointerEvent) => {
      dragging.current = true;
      pointer.current = {
        x: event.clientX,
        y: event.clientY,
        phi: phiOffset.current,
        tilt,
      };
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!pointer.current) return;
      const dx = event.clientX - pointer.current.x;
      const dy = event.clientY - pointer.current.y;
      phiOffset.current = pointer.current.phi + dx / 280;
      tilt = Math.min(1.2, Math.max(-1.2, pointer.current.tilt - dy / 280));
    };
    const onPointerUp = () => {
      dragging.current = false;
      pointer.current = null;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      globe.destroy();
    };
  }, []);

  return (
    <div className="pointer-events-auto absolute top-1/2 right-[-18%] z-0 aspect-square w-[min(118vh,1280px)] -translate-y-[46%] sm:right-[-10%] lg:right-[-6%]">
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        aria-label="Rotating globe of trade routes"
      />
      {places.map((place) => (
        <span
          key={place.id}
          ref={(node) => {
            labels.current[place.id] = node;
          }}
          className="globe-label pointer-events-none text-[10px] tracking-[0.16em] whitespace-nowrap text-white uppercase"
          hidden
          style={{ positionAnchor: `--cobe-${place.id}` }}
        >
          {place.name}
        </span>
      ))}
      {places.map((place) =>
        vehicles[place.id] ? (
          <span
            key={`${place.id}-icon`}
            ref={(node) => {
              icons.current[place.id] = node;
            }}
            className="globe-vehicle pointer-events-none"
            hidden
            style={{ positionAnchor: `--cobe-${place.id}` }}
          >
            <VehicleIcon type={vehicles[place.id]} />
          </span>
        ) : null,
      )}
    </div>
  );
}
