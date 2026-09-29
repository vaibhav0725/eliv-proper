"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

const places = [
  { id: "sf", name: "San Francisco", location: [37.78, -122.44] as [number, number] },
  { id: "nyc", name: "New York", location: [40.71, -74.01] as [number, number] },
  { id: "london", name: "London", location: [51.51, -0.13] as [number, number] },
  { id: "tokyo", name: "Tokyo", location: [35.68, 139.65] as [number, number] },
  { id: "sydney", name: "Sydney", location: [-33.87, 151.21] as [number, number] },
  { id: "singapore", name: "Singapore", location: [1.35, 103.82] as [number, number] },
  { id: "dubai", name: "Dubai", location: [25.2, 55.27] as [number, number] },
  { id: "saopaulo", name: "São Paulo", location: [-23.55, -46.63] as [number, number] },
  { id: "capetown", name: "Cape Town", location: [-33.92, 18.42] as [number, number] },
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

const arc = [0.3, 0.5, 1] as [number, number, number];

const arcs = [
  { id: "sf-tokyo", from: places[0].location, to: places[3].location, color: arc },
  { id: "nyc-london", from: places[1].location, to: places[2].location, color: arc },
  { id: "london-dubai", from: places[2].location, to: places[6].location, color: arc },
];

export function HomeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labels = useRef<Record<string, HTMLSpanElement | null>>({});
  const pointer = useRef<{ x: number; y: number; phi: number; tilt: number } | null>(null);
  const phiOffset = useRef(0);
  const dragging = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let phi = 0;
    let tilt = 0.2;
    let frame = 0;
    let width = canvas.offsetWidth;

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: width * 2,
      height: width * 2,
      phi,
      theta: tilt,
      dark: 2,
      diffuse: 0,
      mapSamples: 10000,
      mapBrightness: 12,
      mapBaseBrightness: 0,
      baseColor: [0.02, 0.02, 0.1],
      markerColor: [0, 1, 0.8],
      glowColor: [0, 0.5, 0.8],
      markerElevation: 0,
      arcColor: arc,
      arcWidth: 1,
      arcHeight: 0.4,
      scale: 1,
      offset: [0, 0],
      markers: places.map((place) => ({
        id: place.id,
        location: place.location,
        size: 0.05,
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
        label.hidden = !isFacing(place.location[0], place.location[1], currentPhi, tilt);
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
          className="globe-label pointer-events-none"
          hidden
          style={{ positionAnchor: `--cobe-${place.id}` }}
        >
          {place.name}
        </span>
      ))}
    </div>
  );
}
