import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {EASE_IN, EASE_IN_OUT, tween} from '../anim';

/**
 * Wraps every scene with:
 *  - a constant slow camera drift, scale 1.0 -> 1 + push over the scene (inOut cubic)
 *  - a quick 8-frame "push through" exit: scale 1 -> 1.06 and opacity -> 0
 */
export const SceneShell: React.FC<{
  duration: number;
  push?: number;
  exit?: boolean;
  children: React.ReactNode;
}> = ({duration, push = 0.04, exit = true, children}) => {
  const frame = useCurrentFrame();
  const cam = tween(frame, [0, duration], [1, 1 + push], EASE_IN_OUT);
  const ex = exit ? tween(frame, [duration - 8, duration], [0, 1], EASE_IN) : 0;
  const scale = cam * (1 + 0.06 * ex);
  return (
    <AbsoluteFill style={{transform: `scale(${scale})`, opacity: 1 - ex}}>
      {children}
    </AbsoluteFill>
  );
};
