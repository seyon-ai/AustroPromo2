import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE_OUT, keys, rnd} from '../anim';

/**
 * Deterministic particle burst. Each particle's position is a closed-form
 * function of the frame since `start`, so it renders identically every time.
 */
export const Burst: React.FC<{
  start: number;
  x: number;
  y: number;
  color: string;
  count?: number;
  life?: number;
  radius?: number;
  seed?: number;
}> = ({start, x, y, color, count = 30, life = 34, radius = 340, seed = 1}) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  if (local < 0 || local > life) return null;
  const t = Math.min(1, Math.max(0, local / life));
  const p = EASE_OUT(t);
  return (
    <>
      {Array.from({length: count}, (_, i) => {
        const a = rnd(i * 1.7 + seed) * Math.PI * 2;
        const d = radius * (0.4 + rnd(i * 3.1 + seed) * 0.6);
        const size = 3 + rnd(i * 5.3 + seed) * 6;
        const px = x + Math.cos(a) * d * p;
        const py = y + Math.sin(a) * d * p + 0.00035 * local * local; // slight gravity
        const op = keys(local, [0, 4, life], [0, 1, 0]);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px - size / 2,
              top: py - size / 2,
              width: size,
              height: size,
              borderRadius: '50%',
              background: color,
              opacity: op,
              boxShadow: `0 0 ${size * 3}px ${color}`,
            }}
          />
        );
      })}
    </>
  );
};
