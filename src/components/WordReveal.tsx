import React from 'react';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {COLORS, HEADLINE_FONT, TRACKING_HEADLINE} from '../theme';
import {HERO, SNAP, tween} from '../anim';

/**
 * Word-by-word reveal: each word moves translateY 40 -> 0 with opacity and
 * blur 8px -> 0. Stagger is in frames. `hero` uses the overshoot spring.
 */
export const WordReveal: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  hero?: boolean;
  style?: React.CSSProperties;
  wordStyle?: React.CSSProperties;
}> = ({text, start, stagger = 3, hero = false, style, wordStyle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', ...style}}>
      {words.map((word, i) => {
        const local = frame - (start + i * stagger);
        const p = spring({
          frame: Math.max(0, local),
          fps,
          config: hero ? HERO : SNAP,
        });
        const y = (1 - p) * 40;
        const op = tween(local, [0, 6], [0, 1]);
        const blur = tween(local, [0, 12], [8, 0]);
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: 'inline-block',
              transform: `translateY(${y}px)`,
              opacity: op,
              filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
              marginRight: '0.22em',
              fontFamily: HEADLINE_FONT,
              fontWeight: 700,
              letterSpacing: TRACKING_HEADLINE,
              color: COLORS.text,
              whiteSpace: 'pre',
              ...wordStyle,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
