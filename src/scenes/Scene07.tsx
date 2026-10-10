import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE_IN_OUT, keys, sp, tween, SNAP} from '../anim';
import {Counter} from '../components/Counter';
import {GlassCard} from '../components/GlassCard';
import {Sfx} from '../components/Sfx';
import {Label, StoreItem} from '../components/UI';
import {WordReveal} from '../components/WordReveal';
import {COLORS, UI_FONT} from '../theme';

// Scene 07 - four rapid beats, hard cuts:
// 1) Austro Store with a shimmering time-limited effect
// 2) AustroSignature drawn on with stroke-dashoffset
// 3) AustroPoints counter
// 4) AI Referee whistle with a scan-line sweep (violet accent)

const B1 = 0;
const B2 = 82;
const B3 = 147;
const B4 = 199;
const END = 284;

const Headline: React.FC<{text: string}> = ({text}) => (
  <div style={{position: 'absolute', left: 160, top: 120}}>
    <WordReveal text={text} start={4} stagger={4} style={{fontSize: 118}} />
  </div>
);

const StoreBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = sp(frame, fps, 2, SNAP);
  const sheen = tween(frame, [14, 70], [-260, 560], EASE_IN_OUT);
  return (
    <AbsoluteFill>
      <Headline text="Austro Store." />
      <div style={{position: 'absolute', left: 160, top: 340, opacity: card, transform: `translateY(${(1 - card) * 60}px)`}}>
        <StoreItem width={580} sheenX={sheen} />
      </div>
      <div style={{position: 'absolute', left: 900, top: 420, width: 760, opacity: tween(frame, [28, 44], [0, 1])}}>
        <Label>Austro Store</Label>
        <div style={{fontFamily: UI_FONT, fontSize: 40, color: COLORS.text, marginTop: 20, lineHeight: 1.4}}>
          Profile cosmetics and identity customizations.
        </div>
        <div style={{fontFamily: UI_FONT, fontSize: 40, color: COLORS.muted, marginTop: 18, lineHeight: 1.4}}>
          Including time-limited visual effects.
        </div>
      </div>
      <Sfx name="shimmer" at={14} />
    </AbsoluteFill>
  );
};

// Signature path: a hand-built loop, normalised to pathLength=1 for stroke-dashoffset.
const SIG_PATH =
  'M24 84 C34 40 46 22 52 40 C58 60 44 92 60 76 C74 62 74 36 86 50 C98 64 92 88 110 74 C124 62 126 34 140 40 C152 46 146 80 160 74 C172 68 176 50 192 56 C204 62 200 84 218 74 C232 66 240 40 256 46 C268 50 264 82 282 74 C294 68 300 52 318 58 C324 61 328 64 332 66';

const SignatureBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = sp(frame, fps, 2, SNAP);
  const draw = tween(frame, [6, 50], [0, 1], EASE_IN_OUT);
  return (
    <AbsoluteFill>
      <Headline text="AustroSignature." />
      <GlassCard
        style={{
          position: 'absolute',
          left: 160,
          top: 390,
          width: 1000,
          height: 460,
          padding: 56,
          opacity: card,
          transform: `translateY(${(1 - card) * 60}px)`,
        }}
      >
        <svg width={888} height={300} viewBox="0 0 340 120" style={{overflow: 'visible'}}>
          <path
            d={SIG_PATH}
            pathLength={1}
            fill="none"
            stroke={COLORS.text}
            strokeWidth={4.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
          />
        </svg>
        <div style={{fontFamily: UI_FONT, fontSize: 26, color: COLORS.muted, marginTop: 18}}>
          Your signature, tied to your AustroClash identity.
        </div>
      </GlassCard>
      <Sfx name="whoosh" at={0} />
      <Sfx name="pop" at={50} volume={0.45} />
    </AbsoluteFill>
  );
};

const PointsBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = sp(frame, fps, 2, SNAP);
  const ticks = Array.from({length: 10}, (_, i) => 4 + i * 4);
  return (
    <AbsoluteFill>
      <Headline text="Spend AustroPoints." />
      <GlassCard
        style={{
          position: 'absolute',
          left: 160,
          top: 380,
          width: 1100,
          height: 420,
          padding: '60px 64px',
          opacity: card,
          transform: `translateY(${(1 - card) * 60}px)`,
        }}
      >
        <Label>AustroPoints balance</Label>
        <Counter
          to={1250}
          start={4}
          end={44}
          style={{display: 'block', fontFamily: UI_FONT, fontWeight: 500, fontSize: 200, color: COLORS.text, marginTop: 24, letterSpacing: '-0.02em'}}
        />
      </GlassCard>
      <div style={{position: 'absolute', left: 1340, top: 420, width: 420, fontFamily: UI_FONT, fontSize: 32, color: COLORS.muted, lineHeight: 1.45, opacity: tween(frame, [30, 46], [0, 1])}}>
        Used in designated features, including the Store and AUSTRO VAR.
      </div>
      {ticks.map((t) => (
        <Sfx key={t} name="tick" at={t} />
      ))}
    </AbsoluteFill>
  );
};

const RefereeBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const card = sp(frame, fps, 2, SNAP);
  const scan = tween(frame, [14, 62], [0, 620], EASE_IN_OUT);
  const scanOp = keys(frame, [12, 18, 58, 66], [0, 1, 1, 0]);
  return (
    <AbsoluteFill>
      <Headline text="AI Referee." />
      <GlassCard
        style={{
          position: 'absolute',
          left: 160,
          top: 390,
          width: 300,
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: card,
          transform: `scale(${0.9 + 0.1 * card})`,
        }}
      >
        <svg width={170} height={170} viewBox="0 0 120 120">
          <circle cx="50" cy="26" r="12" fill="none" stroke={COLORS.text} strokeWidth={5} />
          <rect x="16" y="44" width="70" height="44" rx="20" fill="none" stroke={COLORS.text} strokeWidth={5} />
          <path d="M86 56 L104 56 L104 76 L86 76" fill="none" stroke={COLORS.text} strokeWidth={5} strokeLinejoin="round" />
          <circle cx="50" cy="66" r="8" fill={COLORS.text} />
        </svg>
      </GlassCard>

      <div style={{position: 'absolute', left: 540, top: 390, width: 1220, height: 460}}>
        <GlassCard style={{width: 1220, height: 460, padding: 40, overflow: 'hidden', position: 'relative'}}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 78,
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                fontFamily: UI_FONT,
                fontSize: 30,
                color: COLORS.text,
                opacity: tween(frame, [4 + i * 5, 12 + i * 5], [0, 1]),
              }}
            >
              <span>Entry {i + 1} · evaluation check</span>
              <span style={{color: COLORS.muted}}>Reviewed</span>
            </div>
          ))}
          <div style={{position: 'absolute', left: 0, right: 0, top: scan, height: 2, background: COLORS.violet, boxShadow: `0 0 26px ${COLORS.violet}`, opacity: scanOp}} />
        </GlassCard>
        <div style={{fontFamily: UI_FONT, fontSize: 30, color: COLORS.muted, marginTop: 30, lineHeight: 1.4, opacity: tween(frame, [30, 46], [0, 1])}}>
          AI-assisted support for selected evaluation and moderation tasks.
        </div>
      </div>
      <Sfx name="pop" at={0} volume={0.5} />
      <Sfx name="whoosh" at={14} volume={0.4} />
    </AbsoluteFill>
  );
};

export const Scene07: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={B1} durationInFrames={B2 - B1}>
      <StoreBeat />
    </Sequence>
    <Sequence from={B2} durationInFrames={B3 - B2}>
      <SignatureBeat />
    </Sequence>
    <Sequence from={B3} durationInFrames={B4 - B3}>
      <PointsBeat />
    </Sequence>
    <Sequence from={B4} durationInFrames={END - B4}>
      <RefereeBeat />
    </Sequence>
    <Sfx name="whoosh" at={B2} />
    <Sfx name="whoosh" at={B3} />
    <Sfx name="whoosh" at={B4} />
  </AbsoluteFill>
);
