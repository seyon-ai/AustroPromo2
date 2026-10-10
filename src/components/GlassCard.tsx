import React from 'react';
import {GLASS} from '../theme';

export const GlassCard: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({children, style}) => {
  return (
    <div
      style={{
        background: GLASS.fill,
        border: GLASS.border,
        backdropFilter: GLASS.blur,
        WebkitBackdropFilter: GLASS.blur,
        borderRadius: GLASS.radius,
        boxShadow: '0 40px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
