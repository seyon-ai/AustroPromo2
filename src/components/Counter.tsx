import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE_OUT, tween} from '../anim';

/** Counts from `from` to `to` between `start` and `end` (frames). Tabular numerals. */
export const Counter: React.FC<{
  from?: number;
  to: number;
  start: number;
  end: number;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({from = 0, to, start, end, suffix, style}) => {
  const frame = useCurrentFrame();
  const v = Math.round(tween(frame, [start, end], [from, to], EASE_OUT));
  return (
    <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>
      {v.toLocaleString('en-US')}
      {suffix ?? ''}
    </span>
  );
};
