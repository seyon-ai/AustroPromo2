import React from 'react';
import {useVideoConfig} from 'remotion';
import {HEIGHT, WIDTH} from '../timing';

/**
 * Design canvas is always 1920x1080. In portrait (1080x1920) the canvas is
 * scaled to the frame width and centred vertically. This keeps the landscape
 * layout as the source of truth; the vertical cut is a working reuse, not a
 * re-layout.
 */
export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {width, height} = useVideoConfig();
  const portrait = height > width;
  const k = portrait ? width / WIDTH : Math.min(width / WIDTH, height / HEIGHT);
  const left = (width - WIDTH * k) / 2;
  const top = (height - HEIGHT * k) / 2;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: WIDTH,
        height: HEIGHT,
        transform: `scale(${k})`,
        transformOrigin: 'top left',
      }}
    >
      {children}
    </div>
  );
};
