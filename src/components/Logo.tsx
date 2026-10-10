import React from 'react';

// Geometry of the AustroClash mark, viewBox 0 0 100 100.
// Generated from the same polygons as scripts/make_logo.py so the raster and
// the animated SVG match. The three parts are separate <g> groups so each can
// be moved on its own: top chevron, diamond, bottom chevron.
export const LOGO_TOP =
  '16.40,48.78 50.00,17.84 83.60,48.78 92.40,39.22 50.00,0.16 7.60,39.22';
export const LOGO_BOTTOM =
  '7.60,60.78 50.00,99.84 92.40,60.78 83.60,51.22 50.00,82.16 16.40,51.22';
export const LOGO_DIAMOND = '50.00,35.00 65.00,50.00 50.00,65.00 35.00,50.00';

export type LogoProps = {
  size: number;
  color?: string;
  /** Vertical offset of the top chevron, in viewBox units (negative = from above). */
  topY?: number;
  /** Vertical offset of the bottom chevron, in viewBox units (positive = from below). */
  bottomY?: number;
  /** Scale of the diamond around its centre. */
  diamondScale?: number;
  /** Opacity of the diamond only. */
  diamondOpacity?: number;
  style?: React.CSSProperties;
};

export const Logo: React.FC<LogoProps> = ({
  size,
  color = '#F4F4F5',
  topY = 0,
  bottomY = 0,
  diamondScale = 1,
  diamondOpacity = 1,
  style,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{overflow: 'visible', display: 'block', ...style}}
    >
      <g id="logo-top" transform={`translate(0 ${topY})`}>
        <polygon points={LOGO_TOP} fill={color} />
      </g>
      <g
        id="logo-diamond"
        opacity={diamondOpacity}
        transform={`translate(50 50) scale(${diamondScale}) translate(-50 -50)`}
      >
        <polygon points={LOGO_DIAMOND} fill={color} />
      </g>
      <g id="logo-bottom" transform={`translate(0 ${bottomY})`}>
        <polygon points={LOGO_BOTTOM} fill={color} />
      </g>
    </svg>
  );
};
