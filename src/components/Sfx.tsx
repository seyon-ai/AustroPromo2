import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

// SFX files live in public/sfx/ (synthesized by scripts/make_sfx_music.py).
const SFX = {
  whoosh: {file: 'sfx/whoosh.wav', volume: 0.55},
  impact: {file: 'sfx/impact.wav', volume: 0.85},
  tick: {file: 'sfx/tick.wav', volume: 0.32},
  pop: {file: 'sfx/pop.wav', volume: 0.6},
  shimmer: {file: 'sfx/shimmer.wav', volume: 0.42},
} as const;

export type SfxName = keyof typeof SFX;

/** A sound placed at an exact frame of its parent sequence. */
export const Sfx: React.FC<{name: SfxName; at: number; volume?: number}> = ({
  name,
  at,
  volume,
}) => {
  const s = SFX[name];
  return (
    <Sequence from={at}>
      <Audio src={staticFile(s.file)} volume={volume ?? s.volume} />
    </Sequence>
  );
};
