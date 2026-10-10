import React from 'react';
import {AbsoluteFill, Easing, Sequence, useCurrentFrame} from 'remotion';
import {tween, rnd} from '../anim';
import {PostCard} from '../components/UI';
import {WordReveal} from '../components/WordReveal';
import {Sfx} from '../components/Sfx';
import {COLORS} from '../theme';

// Scene 01 - "Everyone's posting. Nobody's competing."
// Post cards flick past on an 8-frame cadence, then freeze and desaturate
// on "Nobody's competing." (VO word at ~frame 45).

const FREEZE = 45;
const TICKS = [0, 8, 16, 24, 32, 40];
const AUTHORS = ['Arjun K.', 'Mira S.', 'Dev R.', 'Lena P.', 'Omar T.', 'Ines G.'];
const IDEAS = [
  'Pocket bike repair station',
  'Night-market map, hand drawn',
  'Study-group playlist builder',
  'Community garden layout v2',
  'Poster set for a film club',
  'Weekend hike planner',
  'Logo sketches for a bakery',
  'Remote-work coffee map',
];

const CARDS = Array.from({length: 24}, (_, i) => {
  const tick = Math.floor(i / 4);
  return {
    i,
    spawn: TICKS[tick] + (i % 4) * 2,
    x: 960 + (rnd(i * 3.7) - 0.5) * 1100,
    y: 540 + (rnd(i * 5.3 + 1) - 0.5) * 640,
    rot: (rnd(i * 7.1 + 2) - 0.5) * 16,
    side: i % 2 ? 1 : -1,
    author: AUTHORS[i % AUTHORS.length],
    title: IDEAS[i % IDEAS.length],
    tone: i % 5,
  };
});

export const Scene01: React.FC = () => {
  // Local frame (the SceneShell already gives us a local timeline).
  const frame = useCurrentFrame();
  const f = Math.min(frame, FREEZE); // motion stops at the freeze
  const desat = tween(frame, [FREEZE, FREEZE + 12], [0, 1]);
  const veil = tween(frame, [FREEZE, FREEZE + 14], [0, 0.74]);
  const preFade = tween(frame, [38, 46], [1, 0]);
  const postIn = tween(frame, [FREEZE, FREEZE + 4], [0, 1]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: `grayscale(${desat})`}}>
        {CARDS.map((c) => {
          if (f < c.spawn) return null;
          const p = tween(f - c.spawn, [0, 7], [0, 1], Easing.out(Easing.exp));
          const x = c.x + c.side * (1 - p) * 1500;
          const rot = c.rot + (1 - p) * 22 * c.side;
          return (
            <React.Fragment key={c.i}>
            {p < 0.98 ? (
              <div
                style={{
                  position: 'absolute',
                  left: x - 280 - c.side * 90 * (1 - p),
                  top: c.y - 130,
                  transform: `rotate(${rot}deg)`,
                  opacity: 0.22 * (1 - p),
                }}
              >
                <PostCard author={c.author} tone={c.tone} title={c.title} tag="Feed" width={560} />
              </div>
            ) : null}
            <div
              style={{
                position: 'absolute',
                left: x - 280,
                top: c.y - 130,
                transform: `rotate(${rot}deg)`,
              }}
            >
              <PostCard author={c.author} tone={c.tone} title={c.title} tag="Feed" width={560} />
            </div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>

      <AbsoluteFill style={{background: `rgba(7,7,10,${veil})`}} />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 430,
          display: 'flex',
          justifyContent: 'center',
          opacity: preFade,
          textShadow: '0 4px 60px rgba(0,0,0,0.9)',
        }}
      >
        <WordReveal
          text="Everyone's posting."
          start={4}
          stagger={4}
          style={{fontSize: 128, justifyContent: 'center', color: COLORS.text}}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 430,
          display: 'flex',
          justifyContent: 'center',
          opacity: postIn,
          textShadow: '0 4px 60px rgba(0,0,0,0.9)',
        }}
      >
        <WordReveal
          text="Nobody's competing."
          start={FREEZE}
          stagger={4}
          hero
          style={{fontSize: 128, justifyContent: 'center', color: COLORS.text}}
        />
      </div>

      {TICKS.map((t) => (
        <Sfx key={t} name="whoosh" at={t} />
      ))}
      <Sequence from={FREEZE}>
        <Sfx name="impact" at={0} />
      </Sequence>
    </AbsoluteFill>
  );
};
