import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE_IN_OUT, sp, tween, SNAP} from '../anim';
import {KingRow} from '../components/UI';
import {Sfx} from '../components/Sfx';
import {WordReveal} from '../components/WordReveal';
import {Label} from '../components/UI';
import {COLORS, UI_FONT} from '../theme';

// Scene 04 - Kingboard. "The Kingboard remembers every winner. Your reign goes on the record."
// Month rows scroll upward. The current King row is gold; past Kings stay dimmed.

const ROWS = [
  {month: 'Sep 2026', category: 'Design', name: 'Arjun K.', tone: 0, current: true},
  {month: 'Aug 2026', category: 'Film', name: 'Mira S.', tone: 1},
  {month: 'Jul 2026', category: 'Startups', name: 'Dev R.', tone: 2},
  {month: 'Jun 2026', category: 'Music', name: 'Lena P.', tone: 3},
  {month: 'May 2026', category: 'Design', name: 'Omar T.', tone: 4},
  {month: 'Apr 2026', category: 'Film', name: 'Ines G.', tone: 0},
  {month: 'Mar 2026', category: 'Startups', name: 'Mira S.', tone: 1},
];
const ROW_H = 120;
const GAP = 16;
const LIST_W = 960;

export const Scene04: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scroll = tween(frame, [0, 152], [0, -(ROWS.length - 3) * (ROW_H + GAP) - 40], EASE_IN_OUT);
  const glow = tween(frame, [84, 104], [0, 1], EASE_IN_OUT);
  const headIn = sp(frame, fps, 4, SNAP);

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 160, top: 300, width: 560}}>
        <Label color={COLORS.muted}>Kingboard</Label>
        <WordReveal text="The Kingboard." start={6} stagger={4} style={{fontSize: 124, marginTop: 20}} />
        <div
          style={{
            fontFamily: UI_FONT,
            fontSize: 32,
            color: COLORS.muted,
            marginTop: 34,
            lineHeight: 1.4,
            opacity: tween(frame, [30, 48], [0, 1]),
            transform: `translateY(${(1 - headIn) * 20}px)`,
          }}
        >
          Current Kings and competition history, by category and month.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 800,
          top: 110,
          width: LIST_W,
          height: 860,
          overflow: 'hidden',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)',
        }}
      >
        <div style={{position: 'absolute', left: 0, top: 0, width: LIST_W, transform: `translateY(${scroll}px)`}}>
          {ROWS.map((r, i) => {
            const enter = sp(frame, fps, i * 3, SNAP);
            return (
              <div
                key={r.month}
                style={{
                  position: 'absolute',
                  top: 40 + i * (ROW_H + GAP),
                  left: 0,
                  width: LIST_W,
                  opacity: enter,
                  transform: `translateX(${(1 - enter) * 120}px)`,
                }}
              >
                <KingRow
                  month={r.month}
                  category={r.category}
                  name={r.name}
                  tone={r.tone}
                  current={!!r.current}
                  dim={!r.current}
                  width={LIST_W}
                  glow={r.current ? glow : 0}
                />
              </div>
            );
          })}
        </div>
      </div>

      <Sfx name="whoosh" at={0} />
      <Sfx name="pop" at={84} />
    </AbsoluteFill>
  );
};
