import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {HERO, sp, tween} from '../anim';
import {Logo} from '../components/Logo';
import {LetterReveal} from '../components/LetterReveal';
import {Sfx} from '../components/Sfx';
import {SLAM} from '../anim';
import {COLORS, HEADLINE_FONT, SITE_URL, UI_FONT} from '../theme';

// Scene 08 - "Stop scrolling. Start clashing. AustroClash."
// Words slam in one at a time, then the lockup lands and holds. The URL line uses SITE_URL.
// Word slam frames come from the VO word timings: STOP 4, SCROLLING 18, START 39, CLASHING 52, AUSTROCLASH 77.

const WORDS = [
  {t: 'STOP', at: 4, until: 18},
  {t: 'SCROLLING.', at: 18, until: 39},
  {t: 'START', at: 39, until: 52},
  {t: 'CLASHING.', at: 52, until: 77},
  {t: 'AUSTROCLASH.', at: 77, until: 102},
];
const LOCKUP = 102;
const LOGO = 220;

export const Scene08: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const lockTop = sp(frame, fps, LOCKUP, SLAM);
  const lockDiamond = sp(frame, fps, LOCKUP + 10, {damping: 10, stiffness: 150});
  const glowIn = tween(frame, [LOCKUP, LOCKUP + 28], [0, 1]);
  const urlIn = tween(frame, [LOCKUP + 30, LOCKUP + 46], [0, 1]);

  return (
    <AbsoluteFill>
      {/* Slam words, one at a time */}
      {WORDS.map((w) => {
        if (frame < w.at || frame >= w.until) return null;
        const local = frame - w.at;
        const p = sp(frame, fps, w.at, HERO);
        const scale = 1.6 - 0.6 * p;
        const op = tween(local, [0, 3], [0, 1]);
        return (
          <div
            key={w.t}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: op,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 230,
                letterSpacing: '-0.03em',
                color: COLORS.text,
                transform: `scale(${scale})`,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{fontFamily: HEADLINE_FONT}}>{w.t}</span>
            </div>
          </div>
        );
      })}

      {/* Final lockup: logo + wordmark + URL, subtle gold and violet glows */}
      {frame >= LOCKUP ? (
        <AbsoluteFill style={{opacity: 1}}>
          <div
            style={{
              position: 'absolute',
              left: 700 - 380,
              top: 360 - 380,
              width: 760,
              height: 760,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245,197,66,0.13) 0%, rgba(245,197,66,0) 62%)',
              opacity: glowIn,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 1220 - 380,
              top: 360 - 380,
              width: 760,
              height: 760,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124,92,255,0.15) 0%, rgba(124,92,255,0) 62%)',
              opacity: glowIn,
            }}
          />
          <div style={{position: 'absolute', left: 960 - LOGO / 2, top: 250}}>
            <Logo size={LOGO} topY={(1 - lockTop) * -150} bottomY={(1 - lockTop) * 150} diamondScale={lockDiamond} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center'}}>
            <LetterReveal text="AUSTROCLASH" start={LOCKUP + 8} stagger={2} style={{fontSize: 156, color: COLORS.text, justifyContent: 'center'}} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 780,
              textAlign: 'center',
              fontFamily: UI_FONT,
              fontWeight: 500,
              fontSize: 42,
              letterSpacing: '0.08em',
              color: COLORS.muted,
              opacity: urlIn,
            }}
          >
            {SITE_URL}
          </div>
        </AbsoluteFill>
      ) : null}

      <Sfx name="whoosh" at={0} />
      {WORDS.map((w) => (
        <Sfx key={w.t} name="impact" at={w.at} volume={0.7} />
      ))}
      <Sfx name="impact" at={LOCKUP} />
      <Sfx name="shimmer" at={LOCKUP + 30} volume={0.3} />
    </AbsoluteFill>
  );
};
