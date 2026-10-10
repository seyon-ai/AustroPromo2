import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {sp, tween, SNAP} from '../anim';
import {Label, ProviderReply, VarRequestCard} from '../components/UI';
import {Sfx} from '../components/Sfx';
import {WordReveal} from '../components/WordReveal';
import {COLORS, UI_FONT} from '../theme';

// Scene 06 - AUSTRO VAR, the Value and Resource Arena. Violet is the accent here.
// "Providers respond" at ~frame 106. "You choose." at ~frame 205, which selects a provider.

const REPLIES = [
  {name: 'Dev R.', tone: 2, text: 'Can take this on. I can share a draft within a few days.', at: 106},
  {name: 'Lena P.', tone: 3, text: 'Happy to help. I will send a short plan and a sample layout.', at: 114},
  {name: 'Omar T.', tone: 4, text: 'Interested. Could you share the workshop details first?', at: 122},
];
const SELECTED_INDEX = 1;
const SELECT_AT = 205;

export const Scene06: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const wash = tween(frame, [0, 40], [0, 1]);
  const cardIn = sp(frame, fps, 14, SNAP);
  const selected = sp(frame, fps, SELECT_AT, {damping: 11, stiffness: 190});
  const dim = tween(frame, [SELECT_AT, SELECT_AT + 14], [0, 1]);
  const labelIn = tween(frame, [96, 110], [0, 1]);

  return (
    <AbsoluteFill>
      {/* Violet wash: the one accent on screen. */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 42% 50%, rgba(124,92,255,0.26) 0%, rgba(124,92,255,0.08) 40%, rgba(124,92,255,0) 70%)',
          opacity: wash,
          pointerEvents: 'none',
        }}
      />

      <div style={{position: 'absolute', left: 160, top: 120}}>
        <WordReveal
          text="AUSTRO VAR"
          start={4}
          stagger={3}
          hero
          style={{fontSize: 132}}
          wordStyle={{color: COLORS.violet}}
        />
        <div
          style={{
            fontFamily: UI_FONT,
            fontSize: 34,
            color: COLORS.muted,
            marginTop: 22,
            opacity: tween(frame, [88, 104], [0, 1]),
          }}
        >
          The Value and Resource Arena
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 160,
          top: 430,
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 80}px)`,
        }}
      >
        <VarRequestCard width={760} />
      </div>

      <div style={{position: 'absolute', left: 1140, top: 330, opacity: labelIn}}>
        <Label color={COLORS.violet}>Provider replies</Label>
      </div>

      {REPLIES.map((r, i) => {
        const e = sp(frame, fps, r.at, SNAP);
        const isSel = i === SELECTED_INDEX;
        const selP = isSel ? selected : 0;
        const dimP = isSel ? 0 : dim;
        return (
          <div
            key={r.name}
            style={{
              position: 'absolute',
              left: 1140 + (1 - e) * 1000,
              top: 380 + i * 200,
              opacity: Math.min(1, e * 1.2),
            }}
          >
            <ProviderReply name={r.name} tone={r.tone} text={r.text} width={640} selected={Math.max(0, selP)} dim={dimP} />
          </div>
        );
      })}

      <Sfx name="whoosh" at={0} />
      {REPLIES.map((r) => (
        <Sfx key={r.name} name="whoosh" at={r.at} volume={0.42} />
      ))}
      <Sfx name="pop" at={SELECT_AT} />
    </AbsoluteFill>
  );
};
