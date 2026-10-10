import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {keys, rnd, sp, SLAM, tween} from '../anim';
import {Logo} from '../components/Logo';
import {LetterReveal} from '../components/LetterReveal';
import {Burst} from '../components/Particles';
import {PostCard} from '../components/UI';
import {WordReveal} from '../components/WordReveal';
import {Sfx} from '../components/Sfx';
import {COLORS} from '../theme';

// Scene 02 - "AustroClash is where ideas go to fight."
// Cards shatter outward, chevrons slam in from top and bottom, the diamond pops
// with a gold flash, then the wordmark reveals letter by letter.

const SHARDS = Array.from({length: 9}, (_, i) => ({
  i,
  ang: rnd(i * 2.3) * Math.PI * 2,
  dist: 900 + rnd(i * 4.1) * 700,
  rot: (rnd(i * 6.7) - 0.5) * 140,
  x: 960 + (rnd(i * 1.9) - 0.5) * 300,
  y: 540 + (rnd(i * 2.9) - 0.5) * 240,
  author: ['Arjun K.', 'Mira S.', 'Dev R.', 'Lena P.', 'Omar T.', 'Ines G.', 'Omar T.', 'Mira S.', 'Dev R.'][i],
  title: ['Pocket bike repair', 'Night-market map', 'Playlist builder', 'Garden layout', 'Film club posters', 'Hike planner', 'Bakery logo', 'Coffee map', 'Study group'][i],
}));

const LOGO_SIZE = 250;
const LOGO_LEFT = 960 - LOGO_SIZE / 2;
const LOGO_TOP = 250;

export const Scene02: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const slam = sp(frame, fps, 12, SLAM);
  const topY = (1 - slam) * -150;
  const bottomY = (1 - slam) * 150;
  const diamond = sp(frame, fps, 28, {damping: 10, stiffness: 150});
  const flash = keys(frame, [26, 32, 54], [0, 0.75, 0]);
  const tagline = tween(frame, [76, 92], [0, 1]);

  return (
    <AbsoluteFill>
      {/* Shards from the freeze shatter outward. */}
      {SHARDS.map((s) => {
        const local = frame - s.i * 1.2;
        const e = tween(local, [0, 22], [0, 1], Easing.in(Easing.quad));
        const op = 1 - tween(local, [10, 24], [0, 1]);
        return (
          <div
            key={s.i}
            style={{
              position: 'absolute',
              left: s.x - 230,
              top: s.y - 120,
              opacity: op,
              transform: `translate(${Math.cos(s.ang) * s.dist * e}px, ${Math.sin(s.ang) * s.dist * e}px) rotate(${s.rot * e}deg) scale(${1 + 0.25 * e})`,
            }}
          >
            <PostCard author={s.author} tone={s.i} title={s.title} width={460} />
          </div>
        );
      })}

      {/* Gold flash on the diamond pop: the only gold moment in this scene. */}
      <div
        style={{
          position: 'absolute',
          left: 960 - 520,
          top: LOGO_TOP + LOGO_SIZE / 2 - 520,
          width: 1040,
          height: 1040,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(245,197,66,0.9) 0%, rgba(245,197,66,0.25) 26%, rgba(245,197,66,0) 60%)`,
          opacity: flash,
          mixBlendMode: 'screen',
        }}
      />

      <div style={{position: 'absolute', left: LOGO_LEFT, top: LOGO_TOP}}>
        <Logo size={LOGO_SIZE} topY={topY} bottomY={bottomY} diamondScale={diamond} />
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center'}}>
        <LetterReveal text="AUSTROCLASH" start={42} stagger={2} style={{fontSize: 150, color: COLORS.text, justifyContent: 'center'}} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 862,
          display: 'flex',
          justifyContent: 'center',
          opacity: tagline,
        }}
      >
        <WordReveal
          text="where ideas go to fight."
          start={76}
          stagger={3}
          style={{fontSize: 40, justifyContent: 'center', color: COLORS.muted, fontFamily: undefined}}
          wordStyle={{fontFamily: 'Inter, sans-serif', fontWeight: 400, letterSpacing: '0em'}}
        />
      </div>

      <Sfx name="whoosh" at={0} />
      <Sfx name="impact" at={20} />
      <Sfx name="pop" at={28} />
      <Burst start={28} x={960} y={LOGO_TOP + LOGO_SIZE / 2} color="#F5C542" count={34} life={34} radius={420} seed={3} />
    </AbsoluteFill>
  );
};
