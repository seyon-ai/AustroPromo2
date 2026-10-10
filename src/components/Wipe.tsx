import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE_IN_OUT, tween} from '../anim';
import {COLORS} from '../theme';

/**
 * Diagonal wipe through black, cut from the logo's chevron angle.
 * A slanted band sweeps across the frame over 16 frames and fully covers it
 * at the cut point (`at`), so the hard cut between two scenes is hidden.
 * Rendered at Promo level, so `frame` is the global composition frame.
 */
export const WIPE_LEN = 16;
const HALF = 8;
const W = 2400; // band width at the top edge
const SKEW = 200; // slant of the band (chevron angle)

export const Wipe: React.FC<{at: number; width?: number; height?: number}> = ({at, width = 1920, height = 1080}) => {
  const frame = useCurrentFrame();
  const t = frame - (at - HALF);
  if (t < 0 || t > WIPE_LEN) return null;
  const left = tween(t, [0, WIPE_LEN], [-W, width], EASE_IN_OUT);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{position: 'absolute', left: 0, top: 0}}>
        <polygon
          points={`${left},0 ${left + W},0 ${left + W + SKEW},${height} ${left + SKEW},${height}`}
          fill={COLORS.bg0}
        />
        <line
          x1={left + W}
          y1={0}
          x2={left + W + SKEW}
          y2={height}
          stroke="rgba(244,244,245,0.3)"
          strokeWidth={3}
        />
      </svg>
    </AbsoluteFill>
  );
};
