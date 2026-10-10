import React from 'react';
import {UI_FONT} from '../theme';

// Neutral gradient tones; the palette stays grey-on-black apart from accents.
const TONES = [
  'linear-gradient(135deg, #8A8A99 0%, #33333F 100%)',
  'linear-gradient(135deg, #B9B9C6 0%, #4A4A58 100%)',
  'linear-gradient(135deg, #6B6B7A 0%, #1F1F29 100%)',
  'linear-gradient(135deg, #D7D7E0 0%, #5A5A68 100%)',
  'linear-gradient(135deg, #55556A 0%, #17171F 100%)',
];

export const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const Avatar: React.FC<{
  name: string;
  size: number;
  tone?: number;
  ring?: string;
}> = ({name, size, tone = 0, ring}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: TONES[tone % TONES.length],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#F4F4F5',
        fontFamily: UI_FONT,
        fontWeight: 500,
        fontSize: size * 0.36,
        letterSpacing: '0.02em',
        boxShadow: ring ?? 'inset 0 0 0 1px rgba(255,255,255,0.18)',
        flexShrink: 0,
      }}
    >
      {initialsOf(name)}
    </div>
  );
};
