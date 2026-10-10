import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {sp, tween, rnd, SNAP} from '../anim';
import {Avatar} from '../components/Avatar';
import {GlassCard} from '../components/GlassCard';
import {Sfx} from '../components/Sfx';
import {BadgeTile, DMBubble, Label} from '../components/UI';
import {WordReveal} from '../components/WordReveal';
import {COLORS, UI_FONT} from '../theme';

// Scene 05 - "Build your profile. Earn badges. Form Squads with your Allies. Slide into DMs."
// Four hard-cut panels, one per phrase: profile, badges, squads, DMs.
// Cut frames are derived from the VO word timings (silence analysis).

const P1 = 0; // "Build your profile."
const P2 = 49; // "Earn badges."
const P3 = 87; // "Form Squads with your Allies."
const P4 = 149; // "Slide into DMs."

const BADGES = [
  {label: 'First Post', kind: 0},
  {label: 'Commenter', kind: 2},
  {label: 'Early Voter', kind: 4},
  {label: 'Squad Founder', kind: 1},
  {label: 'Sharp Eye', kind: 5},
  {label: 'Good Sport', kind: 3},
];

const Heading: React.FC<{text: string; start?: number}> = ({text, start = 4}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 118, display: 'flex', justifyContent: 'center'}}>
    <WordReveal text={text} start={start} stagger={4} style={{fontSize: 112, justifyContent: 'center'}} />
  </div>
);

const ProfilePanel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = sp(frame, fps, 2, SNAP);
  return (
    <AbsoluteFill>
      <Heading text="Build your profile." />
      <GlassCard
        style={{
          position: 'absolute',
          left: 560,
          top: 340,
          width: 800,
          padding: 48,
          opacity: card,
          transform: `translateY(${(1 - card) * 60}px) scale(${0.96 + 0.04 * card})`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
          <Avatar name="Arjun K." size={150} tone={0} />
          <div>
            <div style={{fontFamily: UI_FONT, fontWeight: 500, fontSize: 52, color: COLORS.text}}>Arjun K.</div>
            <div style={{fontFamily: UI_FONT, fontSize: 26, color: COLORS.muted, marginTop: 6}}>@arjun.k</div>
            <div style={{fontFamily: UI_FONT, fontSize: 26, color: COLORS.muted, marginTop: 14, lineHeight: 1.4}}>
              Designer testing poster ideas in public.
            </div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 22, marginTop: 40}}>
          {[
            ['Posts', '24'],
            ['Badges', '5'],
            ['Squads', '2'],
          ].map(([k, v], i) => (
            <GlassCard key={k} style={{flex: 1, padding: '20px 24px', opacity: sp(frame, fps, 14 + i * 4, SNAP)}}>
              <div style={{fontFamily: UI_FONT, fontSize: 20, color: COLORS.faint, letterSpacing: '0.12em', textTransform: 'uppercase'}}>{k}</div>
              <div style={{fontFamily: UI_FONT, fontWeight: 500, fontSize: 44, color: COLORS.text, marginTop: 4}}>{v}</div>
            </GlassCard>
          ))}
        </div>
      </GlassCard>
      <Sfx name="pop" at={2} volume={0.35} />
    </AbsoluteFill>
  );
};

const BadgesPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Heading text="Earn badges." />
      <div
        style={{
          position: 'absolute',
          left: 330,
          top: 340,
          width: 1260,
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 30,
        }}
      >
        {BADGES.map((b, i) => {
          const p = sp(frame, fps, 4 + i * 5, {damping: 9, stiffness: 170});
          return (
            <div key={b.label} style={{transform: `scale(${Math.max(0, p)})`, opacity: Math.min(1, Math.max(0, p * 2))}}>
              <BadgeTile label={b.label} kind={b.kind} size={230} />
            </div>
          );
        })}
      </div>
      {BADGES.map((_, i) => (
        <Sfx key={i} name="pop" at={4 + i * 5} volume={0.4} />
      ))}
    </AbsoluteFill>
  );
};

const SquadPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const names = ['Arjun K.', 'Mira S.', 'Dev R.', 'Lena P.', 'Omar T.', 'Ines G.'];
  const cx = 960;
  const cy = 600;
  return (
    <AbsoluteFill>
      <Heading text="Form Squads with your Allies." />
      {names.map((n, i) => {
        const angle = (i / names.length) * Math.PI * 2 + 0.4;
        const startR = 620 + rnd(i * 4.4) * 160;
        const endR = 118;
        const p = sp(frame, fps, i * 2, {damping: 14, stiffness: 120});
        const r = startR + (endR - startR) * p;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r * 0.8;
        return (
          <div key={n} style={{position: 'absolute', left: x - 75, top: y - 75}}>
            <Avatar name={n} size={150} tone={i} ring="0 0 0 3px rgba(255,255,255,0.14), 0 20px 50px rgba(0,0,0,0.5)" />
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 820,
          display: 'flex',
          justifyContent: 'center',
          opacity: tween(frame, [34, 48], [0, 1]),
        }}
      >
        <GlassCard style={{padding: '18px 34px'}}>
          <div style={{fontFamily: UI_FONT, fontWeight: 500, fontSize: 30, color: COLORS.text}}>Night Sketch Squad</div>
        </GlassCard>
      </div>
      <Sfx name="whoosh" at={0} />
      <Sfx name="pop" at={26} volume={0.35} />
    </AbsoluteFill>
  );
};

const DMPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shell = sp(frame, fps, 2, SNAP);
  const b1 = sp(frame, fps, 14, {damping: 16, stiffness: 160});
  const b2 = sp(frame, fps, 36, {damping: 16, stiffness: 160});
  const b3 = sp(frame, fps, 58, {damping: 16, stiffness: 160});
  return (
    <AbsoluteFill>
      <Heading text="Slide into DMs." />
      <GlassCard
        style={{
          position: 'absolute',
          left: 570,
          top: 330,
          width: 780,
          height: 560,
          padding: 36,
          display: 'flex',
          flexDirection: 'column',
          opacity: shell,
          transform: `translateY(${(1 - shell) * 60}px)`,
        }}
      >
        <Label style={{marginBottom: 26}}>Direct Messages</Label>
        <div style={{display: 'flex', flexDirection: 'column', gap: 20, flex: 1, justifyContent: 'center'}}>
          <DMBubble text="Quick question about the poster?" progress={b1} />
          <DMBubble text="Sure, sending the draft now." mine progress={b2} />
          <DMBubble text="That's the one. Thank you!" progress={b3} />
        </div>
      </GlassCard>
      <Sfx name="whoosh" at={0} />
      <Sfx name="pop" at={14} volume={0.4} />
      <Sfx name="pop" at={36} volume={0.4} />
      <Sfx name="pop" at={58} volume={0.4} />
    </AbsoluteFill>
  );
};

export const Scene05: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={P1} durationInFrames={P2 - P1}>
        <ProfilePanel />
      </Sequence>
      <Sequence from={P2} durationInFrames={P3 - P2}>
        <BadgesPanel />
      </Sequence>
      <Sequence from={P3} durationInFrames={P4 - P3}>
        <SquadPanel />
      </Sequence>
      <Sequence from={P4}>
        <DMPanel />
      </Sequence>
      {/* Hard cut on each beat */}
      <Sfx name="whoosh" at={P2} />
      <Sfx name="whoosh" at={P3} />
      <Sfx name="whoosh" at={P4} />
    </AbsoluteFill>
  );
};
