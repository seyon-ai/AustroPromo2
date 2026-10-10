import {Easing, interpolate, spring} from 'remotion';

// Every value in the video is a pure function of the current frame.
// These helpers keep that rule in one place.

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Clamped interpolation with optional easing. */
export const tween = (
  frame: number,
  input: [number, number],
  output: [number, number],
  easing?: (t: number) => number,
): number => interpolate(frame, input, output, {...CLAMP, easing});

/** Multi-keyframe clamped interpolation. */
export const keys = (
  frame: number,
  input: number[],
  output: number[],
  easing?: (t: number) => number,
): number => interpolate(frame, input, output, {...CLAMP, easing});

/** Spring entrance that never runs before its delay. */
export const sp = (
  frame: number,
  fps: number,
  delay = 0,
  config: {damping?: number; stiffness?: number; mass?: number} = {damping: 200},
): number => spring({frame: Math.max(0, frame - delay), fps, config});

export const HERO = {damping: 14, stiffness: 120} as const; // overshoot for hero words
export const SLAM = {damping: 16, stiffness: 220, mass: 0.9} as const; // chevrons, slams
export const SNAP = {damping: 200} as const; // snappy, no overshoot

/** Deterministic pseudo-random in [0, 1) from a seed. */
export const rnd = (n: number): number => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const EASE_IN_OUT = Easing.inOut(Easing.cubic);
export const EASE_OUT = Easing.out(Easing.cubic);
export const EASE_IN = Easing.in(Easing.cubic);
