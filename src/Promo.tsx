import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop} from './components/Backdrop';
import {Grain} from './components/Grain';
import {Stage} from './components/Stage';
import {SceneShell} from './components/SceneShell';
import {CLAMP, tween} from './anim';
import {COLORS} from './theme';
import {SCENES, TOTAL_FRAMES, VO} from './timing';
import {Scene01} from './scenes/Scene01';
import {Scene02} from './scenes/Scene02';
import {Scene03} from './scenes/Scene03';
import {Scene04} from './scenes/Scene04';
import {Scene05} from './scenes/Scene05';
import {Scene06} from './scenes/Scene06';
import {Scene07} from './scenes/Scene07';
import {Scene08} from './scenes/Scene08';

// VO windows (absolute composition frames) used to duck the music bed.
const VO_WINDOWS = Object.values(SCENES).map((s) => [s.from + s.voFrom, s.from + s.voFrom + s.voFrames] as const);

/**
 * Music bed level:
 *  0.18 under the picture, ducked to 0.10 while any VO line plays (smooth
 *  8-frame shoulders), and swelling to 0.30 for the final 3 seconds.
 */
export const musicVolumeAt = (f: number): number => {
  let duck = 0;
  for (const [a, b] of VO_WINDOWS) {
    duck = Math.max(duck, interpolate(f, [a - 8, a, b, b + 8], [0, 1, 1, 0], CLAMP));
  }
  const base = 0.18 - 0.08 * duck;
  return interpolate(f, [TOTAL_FRAMES - 90, TOTAL_FRAMES - 60], [base, 0.3], CLAMP);
};

export const Promo: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  // Grain fades out last, over the final 24 frames.
  const grain = tween(frame, [durationInFrames - 24, durationInFrames], [0.06, 0]);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg0, overflow: 'hidden'}}>
      <Backdrop />
      <Stage>
        <Sequence from={SCENES.Scene01Noise.from} durationInFrames={SCENES.Scene01Noise.duration}>
          <SceneShell duration={SCENES.Scene01Noise.duration}>
            <Scene01 />
          </SceneShell>
        </Sequence>
        <Sequence from={SCENES.Scene02Logo.from} durationInFrames={SCENES.Scene02Logo.duration}>
          <SceneShell duration={SCENES.Scene02Logo.duration}>
            <Scene02 />
          </SceneShell>
        </Sequence>
        <Sequence from={SCENES.Scene03Arena.from} durationInFrames={SCENES.Scene03Arena.duration}>
          <SceneShell duration={SCENES.Scene03Arena.duration}>
            <Scene03 />
          </SceneShell>
        </Sequence>
        <Sequence from={SCENES.Scene04Kingboard.from} durationInFrames={SCENES.Scene04Kingboard.duration}>
          <SceneShell duration={SCENES.Scene04Kingboard.duration} push={0.08}>
            <Scene04 />
          </SceneShell>
        </Sequence>
        <Sequence from={SCENES.Scene05Panels.from} durationInFrames={SCENES.Scene05Panels.duration}>
          <SceneShell duration={SCENES.Scene05Panels.duration}>
            <Scene05 />
          </SceneShell>
        </Sequence>
        <Sequence from={SCENES.Scene06Var.from} durationInFrames={SCENES.Scene06Var.duration}>
          <SceneShell duration={SCENES.Scene06Var.duration}>
            <Scene06 />
          </SceneShell>
        </Sequence>
        <Sequence from={SCENES.Scene07Store.from} durationInFrames={SCENES.Scene07Store.duration}>
          <SceneShell duration={SCENES.Scene07Store.duration}>
            <Scene07 />
          </SceneShell>
        </Sequence>
        <Sequence from={SCENES.Scene08Final.from} durationInFrames={SCENES.Scene08Final.duration}>
          <SceneShell duration={SCENES.Scene08Final.duration} exit={false}>
            <Scene08 />
          </SceneShell>
        </Sequence>
      </Stage>

      {/* Voiceover: one clip per scene, starting exactly at its scene's VO frame. */}
      <Sequence from={SCENES.Scene01Noise.from + SCENES.Scene01Noise.voFrom}>
        <Audio src={staticFile(VO['01'].file)} />
      </Sequence>
      <Sequence from={SCENES.Scene02Logo.from + SCENES.Scene02Logo.voFrom}>
        <Audio src={staticFile(VO['02'].file)} />
      </Sequence>
      <Sequence from={SCENES.Scene03Arena.from + SCENES.Scene03Arena.voFrom}>
        <Audio src={staticFile(VO['03'].file)} />
      </Sequence>
      <Sequence from={SCENES.Scene04Kingboard.from + SCENES.Scene04Kingboard.voFrom}>
        <Audio src={staticFile(VO['04'].file)} />
      </Sequence>
      <Sequence from={SCENES.Scene05Panels.from + SCENES.Scene05Panels.voFrom}>
        <Audio src={staticFile(VO['05'].file)} />
      </Sequence>
      <Sequence from={SCENES.Scene06Var.from + SCENES.Scene06Var.voFrom}>
        <Audio src={staticFile(VO['06'].file)} />
      </Sequence>
      <Sequence from={SCENES.Scene07Store.from + SCENES.Scene07Store.voFrom}>
        <Audio src={staticFile(VO['07'].file)} />
      </Sequence>
      <Sequence from={SCENES.Scene08Final.from + SCENES.Scene08Final.voFrom}>
        <Audio src={staticFile(VO['08'].file)} />
      </Sequence>

      {/* Music bed, ducked under VO and swelling for the final 3 seconds. */}
      <Audio src={staticFile('music.wav')} volume={musicVolumeAt} />

      {/* Global finish: vignette and animated grain. */}
      <Grain opacity={grain} />
    </AbsoluteFill>
  );
};
