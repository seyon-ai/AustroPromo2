import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Full-frame film grain. feTurbulence is re-seeded with the current frame,
 * so the noise field changes every frame (animated grain, not a still).
 */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <svg
      width={width}
      height={height}
      style={{position: 'absolute', left: 0, top: 0, opacity, pointerEvents: 'none'}}
    >
      <filter id="austro-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves={3}
          seed={frame}
          stitchTiles="stitch"
          result="noise"
        />
        <feColorMatrix in="noise" type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#austro-grain)" />
    </svg>
  );
};
