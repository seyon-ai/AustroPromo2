import React from 'react';

/**
 * Vote bar. `progress` may overshoot 1 while a spring settles, so the fill
 * can briefly run past its target before it comes back.
 */
export const VoteBar: React.FC<{
  progress: number;
  width: number;
  height?: number;
  fill?: string;
}> = ({progress, width, height = 16, fill = 'linear-gradient(90deg, #F4F4F5 0%, #BDBDC8 100%)'}) => {
  const pct = Math.max(0, progress) * 100;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: height,
        background: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: '100%',
          borderRadius: height,
          background: fill,
          boxShadow: '0 0 18px rgba(255,255,255,0.25)',
        }}
      />
    </div>
  );
};
