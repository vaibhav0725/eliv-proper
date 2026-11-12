/**
 * Story-time landmarks of the 3D film. Kept free of three.js / gsap imports so the
 * page can read them without pulling the 3D scene into the initial bundle.
 */

/** Length of the (legacy) 3D courier prologue; the rest of the 3D film starts here. */
export const PROLOGUE = 17;

export const CHAPTERS = [
  { at: 0, key: "pickup", label: "Pickup" },
  { at: PROLOGUE, key: "yard", label: "Yard" },
  { at: PROLOGUE + 19, key: "load", label: "Load" },
  { at: PROLOGUE + 44, key: "road", label: "Road" },
  { at: PROLOGUE + 70, key: "port", label: "Port" },
  { at: PROLOGUE + 91, key: "sea", label: "Sea" },
] as const;

/**
 * Where the 3D film takes over from the live-action opening: the loaded truck
 * pulls away from the yard and heads for the dockyard. Chosen as the first moment
 * the reach stacker is fully out of frame, so the dissolve never shows it.
 */
export const ROAD_START = PROLOGUE + 45.5;
