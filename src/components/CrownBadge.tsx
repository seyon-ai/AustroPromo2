import React from 'react';

/** Gold crown badge for the current King. Gold is reserved for victory moments. */
export const CrownBadge: React.FC<{
  width: number;
  id: string;
  style?: React.CSSProperties;
}> = ({width, id, style}) => {
  const h = width * 0.9;
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 100 90"
      style={{overflow: 'visible', display: 'block', filter: 'drop-shadow(0 8px 22px rgba(245,197,66,0.45))', ...style}}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE9A6" />
          <stop offset="45%" stopColor="#F5C542" />
          <stop offset="100%" stopColor="#A8781A" />
        </linearGradient>
      </defs>
      <path
        d="M6 70 L2 26 L30 46 L50 10 L70 46 L98 26 L94 70 Z"
        fill={`url(#${id})`}
        stroke="#FFF3C4"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="6" y="72" width="88" height="12" rx="4" fill={`url(#${id})`} />
      <circle cx="50" cy="10" r="4.5" fill="#FFF3C4" />
      <circle cx="2" cy="26" r="3.5" fill="#FFF3C4" />
      <circle cx="98" cy="26" r="3.5" fill="#FFF3C4" />
    </svg>
  );
};
