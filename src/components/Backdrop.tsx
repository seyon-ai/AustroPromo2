import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

/**
 * Global backdrop: #07070A to #111118 radial base, a drifting soft spotlight,
 * and a vignette. Everything is a pure function of the frame.
 */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const sx = 960 + Math.sin(frame / 96) * 420;
  const sy = 470 + Math.cos(frame / 138) * 170;
  const size = 1700;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 45%, ${COLORS.bg1} 0%, ${COLORS.bg0} 72%)`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: sx - size / 2,
          top: sy - size / 2,
          width: size,
          height: size,
          background:
            'radial-gradient(circle, rgba(255,255,255,0.085) 0%, rgba(255,255,255,0.025) 34%, rgba(255,255,255,0) 62%)',
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,0.72) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
