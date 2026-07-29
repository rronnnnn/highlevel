export type HeroObjectConfig = {
  id: string;
  src: string;
  width: number;
  height: number;
  /** base position, in vw/vh from viewport center */
  x: number;
  y: number;
  /** base scale at rest (progress = 0) */
  scale: number;
  /** how far this layer scales by progress = 1. >1 = zooms toward viewer, <1 = drifts away */
  scrollScale: number;
  /** parallax translate multiplier (vh) applied across the scrub */
  scrollSpeed: number;
  /** stacking order */
  z: number;
  /** idle drift amplitude in px, and duration in seconds */
  driftAmplitude: number;
  driftDuration: number;
};

export const heroObjects: HeroObjectConfig[] = [
  {
    id: "obj-01",
    src: "/hero/obj-01.png",
    width: 380,
    height: 380,
    x: -32,
    y: -18,
    scale: 0.9,
    scrollScale: 2.6,
    scrollSpeed: -38,
    z: 3,
    driftAmplitude: 14,
    driftDuration: 7,
  },
  {
    id: "obj-02",
    src: "/hero/obj-02-v2.png",
    width: 320,
    height: 320,
    x: 30,
    y: -10,
    scale: 0.8,
    scrollScale: 0.4,
    scrollSpeed: 26,
    z: 1,
    driftAmplitude: 10,
    driftDuration: 8.5,
  },
  {
    id: "obj-03",
    src: "/hero/obj-03-v2.png",
    width: 280,
    height: 280,
    x: -22,
    y: 24,
    scale: 0.75,
    scrollScale: 1.9,
    scrollSpeed: -22,
    z: 2,
    driftAmplitude: 12,
    driftDuration: 6.5,
  },
  {
    id: "obj-04",
    src: "/hero/obj-04.png",
    width: 240,
    height: 240,
    x: 24,
    y: 22,
    scale: 0.85,
    scrollScale: 0.3,
    scrollSpeed: 34,
    z: 1,
    driftAmplitude: 16,
    driftDuration: 9,
  },
  {
    id: "obj-05",
    src: "/hero/obj-05.png",
    width: 240,
    height: 240,
    x: 0,
    y: -34,
    scale: 0.7,
    scrollScale: 2.2,
    scrollSpeed: -14,
    z: 3,
    driftAmplitude: 9,
    driftDuration: 7.8,
  },
];
