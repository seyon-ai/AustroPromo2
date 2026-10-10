import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE_IN_OUT, lerp, sp, tween, SNAP} from '../anim';
import {Avatar} from '../components/Avatar';
import {CrownBadge} from '../components/CrownBadge';
import {Counter} from '../components/Counter';
import {GlassCard} from '../components/GlassCard';
import {Burst} from '../components/Particles';
import {Sfx} from '../components/Sfx';
import {CategoryTile, Label} from '../components/UI';
import {VoteBar} from '../components/VoteBar';
import {WordReveal} from '../components/WordReveal';
import {COLORS, UI_FONT} from '../theme';

// Scene 03 - Arena. "Post in the Arena. Pick your category. Every month, the post
// with the most votes wins, and its author becomes King."
// The King word lands at ~frame 224. The crown drops onto the leader's avatar there.

const CATS = ['Design', 'Film', 'Startups', 'Music'];
const TILE_X = [180, 580, 980, 1380];
const TILE_Y = 360;
const TILE_W = 360;
const TILE_H = 440;
const TICKS = Array.from({length: 17}, (_, i) => 104 + i * 6);
const CROWN_START = 218;
const CROWN_W = 84;
const LEADER = {name: 'Arjun K.', tone: 0, title: 'Neon night market, hand drawn', votes: 412, target: 0.79};
const RUNNER = {name: 'Mira S.', tone: 1, title: 'Retro poster set for a music night', votes: 259, target: 0.5};

const CandidateRow: React.FC<{
  top: number;
  row: typeof LEADER;
  counterStart: number;
  leader?: boolean;
}> = ({top, row, counterStart, leader = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = sp(frame, fps, counterStart - 14, SNAP);
  const bar = sp(frame, fps, counterStart - 6, {damping: 9, stiffness: 80}) * row.target;
  return (
    <GlassCard
      style={{
        position: 'absolute',
        left: 1040,
        top,
        width: 760,
        height: 230,
        padding: 32,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 50}px)`,
        border: leader ? '1px solid rgba(255,255,255,0.22)' : undefined,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <Avatar name={row.name} size={72} tone={row.tone} />
        <div style={{flex: 1}}>
          <div style={{fontFamily: UI_FONT, fontWeight: 500, fontSize: 26, color: COLORS.text}}>{row.name}</div>
          <div style={{fontFamily: UI_FONT, fontSize: 24, color: COLORS.muted, marginTop: 4}}>{row.title}</div>
        </div>
        <Counter
          to={row.votes}
          start={counterStart}
          end={counterStart + 96}
          style={{fontFamily: UI_FONT, fontWeight: 500, fontSize: 40, color: COLORS.text}}
        />
      </div>
      <div style={{marginTop: 34, marginLeft: 0}}>
        <VoteBar progress={bar} width={696} height={16} />
      </div>
      <div style={{fontFamily: UI_FONT, fontSize: 20, color: COLORS.faint, marginTop: 14, letterSpacing: '0.08em'}}>
        VALID VOTES
      </div>
    </GlassCard>
  );
};

export const Scene03: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Phase A: four category tiles slide in from the right.
  // Phase B: the Design tile zooms to fill the frame.
  // Phase C: the full-screen arena view with the vote race.
  const zoom = sp(frame, fps, 58, {damping: 24, stiffness: 110});
  const arenaIn = tween(frame, [70, 86], [0, 1], EASE_IN_OUT);
  const kingIn = sp(frame, fps, 222, {damping: 11, stiffness: 180});
  const crownDrop = sp(frame, fps, CROWN_START, {damping: 12, stiffness: 150});
  const crownY = (1 - crownDrop) * -260;
  const crownOn = frame >= CROWN_START ? 1 : 0;
  const landed = CROWN_START + 20;

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 160, top: 130, right: 160, opacity: 1 - tween(frame, [54, 66], [0, 1])}}>
        <Label style={{marginBottom: 18}}>Arena</Label>
        <WordReveal text="Pick your category." start={6} stagger={4} style={{fontSize: 118}} />
      </div>

      {CATS.map((name, i) => {
        const entry = sp(frame, fps, 2 + i * 4, SNAP);
        const x = TILE_X[i] + (1 - entry) * 1200;
        const op = tween(frame, [2 + i * 4, 10 + i * 4], [0, 1]);
        const isDesign = i === 0;
        const left = isDesign ? lerp(x, 0, zoom) : x;
        const top = isDesign ? lerp(TILE_Y, 0, zoom) : TILE_Y;
        const width = isDesign ? lerp(TILE_W, 1920, zoom) : TILE_W;
        const height = isDesign ? lerp(TILE_H, 1080, zoom) : TILE_H;
        // Every tile fades as the arena view takes over (the Design tile included).
        const fade = isDesign ? 1 - tween(frame, [66, 80], [0, 1]) : 1 - tween(frame, [58, 70], [0, 1]);
        return (
          <div key={name} style={{position: 'absolute', left, top, opacity: op * fade}}>
            <CategoryTile name={name} width={width} height={height} style={{borderRadius: isDesign ? lerp(20, 0, zoom) : 20}} />
          </div>
        );
      })}

      {/* Full-screen Design arena */}
      <AbsoluteFill style={{opacity: arenaIn, pointerEvents: 'none'}}>
        <div style={{position: 'absolute', left: 160, top: 250, width: 780}}>
          <Label>Design · current period</Label>
          <WordReveal
            text="Most valid votes wins."
            start={92}
            stagger={3}
            style={{fontSize: 116, marginTop: 24}}
          />
          <div style={{fontFamily: UI_FONT, fontSize: 30, color: COLORS.muted, marginTop: 36, lineHeight: 1.4}}>
            Eligible posts compete for votes during the monthly period.
          </div>
        </div>

        <CandidateRow top={240} row={LEADER} counterStart={104} leader />
        <CandidateRow top={520} row={RUNNER} counterStart={104} />

        {/* King: gold appears only at the victory moment. */}
        <div style={{position: 'absolute', left: 160, top: 690}}>
          <WordReveal text="King." start={224} stagger={0} hero style={{fontSize: 210}} wordStyle={{color: COLORS.gold}} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 1068 - 4,
            top: 272 - CROWN_W * 0.9 + 4,
            opacity: crownOn,
            transform: `translateY(${crownY}px) scale(${kingIn > 0 ? 1 : 0})`,
          }}
        >
          <CrownBadge width={CROWN_W} id="crown-grad-03" />
        </div>
        <Burst start={landed} x={1068 + 36} y={272 + 36} color="#F5C542" count={36} life={40} radius={360} seed={9} />
      </AbsoluteFill>

      {/* Ticks on each counter step */}
      {TICKS.map((t) => (
        <Sfx key={t} name="tick" at={t} />
      ))}
      <Sfx name="whoosh" at={0} />
      <Sfx name="whoosh" at={54} />
      <Sfx name="pop" at={100} />
      <Sfx name="impact" at={landed} />
    </AbsoluteFill>
  );
};
