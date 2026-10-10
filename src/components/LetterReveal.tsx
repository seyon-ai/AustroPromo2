import React from 'react';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {CLAMP, HERO, tween} from '../anim';
import {COLORS, HEADLINE_FONT, TRACKING_HEADLINE} from '../theme';

/** Letter-by-letter reveal for the wordmark (same motion as WordReveal, per glyph). */
export const LetterReveal: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  style?: React.CSSProperties;
}> = ({text, start, stagger = 2, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', whiteSpace: 'pre', ...style}}>
      {text.split('').map((ch, i) => {
        const local = frame - (start + i * stagger);
        const p = spring({frame: Math.max(0, local), fps, config: HERO});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${(1 - p) * 40}px)`,
              opacity: tween(local, [0, 6], [0, 1]),
              filter: `blur(${tween(local, [0, 12], [8, 0])}px)`,
              fontFamily: HEADLINE_FONT,
              fontWeight: 700,
              letterSpacing: TRACKING_HEADLINE,
              color: COLORS.text,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};
