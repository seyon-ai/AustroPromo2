import React from 'react';
import {HEADLINE_FONT, UI_FONT, COLORS, TRACKING_HEADLINE} from '../theme';
import {GlassCard} from './GlassCard';
import {Avatar} from './Avatar';
import {VoteBar} from './VoteBar';

// ---- Shared text helpers -------------------------------------------------

export const Label: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({
  children,
  color = COLORS.muted,
  style,
}) => (
  <div
    style={{
      fontFamily: UI_FONT,
      fontWeight: 500,
      fontSize: 22,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Title: React.FC<{children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({
  children,
  size = 40,
  style,
}) => (
  <div
    style={{
      fontFamily: HEADLINE_FONT,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: TRACKING_HEADLINE,
      color: COLORS.text,
      lineHeight: 1.08,
      ...style,
    }}
  >
    {children}
  </div>
);

// ---- Feed ----------------------------------------------------------------

export const PostCard: React.FC<{
  author: string;
  tone?: number;
  title: string;
  body?: string;
  tag?: string;
  width?: number;
  style?: React.CSSProperties;
}> = ({author, tone = 0, title, body, tag = 'Feed', width = 560, style}) => (
  <GlassCard style={{width, padding: 28, ...style}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
      <Avatar name={author} size={56} tone={tone} />
      <div>
        <div style={{fontFamily: UI_FONT, fontWeight: 500, fontSize: 26, color: COLORS.text}}>{author}</div>
        <div style={{fontFamily: UI_FONT, fontSize: 20, color: COLORS.muted}}>{tag}</div>
      </div>
    </div>
    <Title size={36} style={{marginTop: 22}}>
      {title}
    </Title>
    {body ? (
      <div style={{fontFamily: UI_FONT, fontSize: 23, color: COLORS.muted, marginTop: 12, lineHeight: 1.4}}>
        {body}
      </div>
    ) : null}
    <div style={{display: 'flex', gap: 28, marginTop: 22, fontFamily: UI_FONT, fontSize: 20, color: COLORS.faint}}>
      <span>Like</span>
      <span>Share</span>
      <span>Discuss</span>
    </div>
  </GlassCard>
);

// ---- Arena ---------------------------------------------------------------

export const CategoryTile: React.FC<{name: string; width: number; height: number; style?: React.CSSProperties}> = ({
  name,
  width,
  height,
  style,
}) => (
  <GlassCard
    style={{
      width,
      height,
      padding: 30,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      ...style,
    }}
  >
    <Label>Category</Label>
    <div>
      <Title size={64}>{name}</Title>
      <div style={{fontFamily: UI_FONT, fontSize: 22, color: COLORS.muted, marginTop: 10}}>Monthly period</div>
    </div>
  </GlassCard>
);

// ---- Kingboard -----------------------------------------------------------

export const KingRow: React.FC<{
  month: string;
  category: string;
  name: string;
  tone: number;
  current?: boolean;
  dim?: boolean;
  width: number;
  glow?: number; // 0..1 gold highlight intensity, only for the current King
  style?: React.CSSProperties;
}> = ({month, category, name, tone, current = false, dim = false, width, glow = 0, style}) => {
  const gold = current ? `rgba(245,197,66,${0.55 + 0.35 * glow})` : 'rgba(255,255,255,0.12)';
  return (
    <GlassCard
      style={{
        width,
        height: 120,
        padding: '0 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: dim ? 0.36 : 1,
        border: `1px solid ${gold}`,
        boxShadow: current
          ? `0 0 ${60 * glow}px rgba(245,197,66,${0.35 * glow}), inset 0 1px 0 rgba(255,255,255,0.1)`
          : undefined,
        ...style,
      }}
    >
      <Label style={{width: 200, fontSize: 20}}>{month}</Label>
      <Title size={50} style={{flex: 1}}>
        {category}
      </Title>
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{fontFamily: UI_FONT, fontSize: 26, color: current ? COLORS.gold : COLORS.text, fontWeight: 500}}>
          {name}
        </div>
        <Avatar name={name} size={58} tone={tone} ring={current ? '0 0 0 2px #F5C542' : undefined} />
      </div>
    </GlassCard>
  );
};

// ---- VAR -----------------------------------------------------------------

export const VarRequestCard: React.FC<{width: number; style?: React.CSSProperties}> = ({width, style}) => (
  <GlassCard style={{width, padding: 40, ...style}}>
    <div
      style={{
        display: 'inline-block',
        fontFamily: UI_FONT,
        fontWeight: 500,
        fontSize: 20,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: COLORS.violet,
        border: '1px solid rgba(124,92,255,0.6)',
        borderRadius: 999,
        padding: '8px 18px',
      }}
    >
      Service need
    </div>
    <Title size={54} style={{marginTop: 26}}>
      Landing page layout for a local workshop
    </Title>
    <div style={{fontFamily: UI_FONT, fontSize: 25, color: COLORS.muted, marginTop: 20, lineHeight: 1.45}}>
      One page, mobile first. Need copy, layout and a clean contact section.
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 30}}>
      <Avatar name="Mira S." size={48} tone={1} />
      <div style={{fontFamily: UI_FONT, fontSize: 22, color: COLORS.text}}>Mira S.</div>
      <div style={{fontFamily: UI_FONT, fontSize: 22, color: COLORS.faint, marginLeft: 'auto'}}>Posted in AUSTRO VAR</div>
    </div>
  </GlassCard>
);

export const ProviderReply: React.FC<{
  name: string;
  tone: number;
  text: string;
  width: number;
  selected?: number; // 0..1 progress of the Selected state
  dim?: number; // 0..1 how much to fade when another provider is chosen
  style?: React.CSSProperties;
}> = ({name, tone, text, width, selected = 0, dim = 0, style}) => {
  const border = `1px solid rgba(124,92,255,${0.15 + 0.6 * selected})`;
  return (
    <GlassCard
      style={{
        width,
        padding: 30,
        border,
        opacity: 1 - 0.55 * dim,
        boxShadow: selected > 0 ? `0 0 ${50 * selected}px rgba(124,92,255,${0.35 * selected})` : undefined,
        ...style,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <Avatar name={name} size={52} tone={tone} />
        <div style={{fontFamily: UI_FONT, fontWeight: 500, fontSize: 25, color: COLORS.text}}>{name}</div>
        <div style={{marginLeft: 'auto'}}>
          <SelectedTick progress={selected} />
        </div>
      </div>
      <div style={{fontFamily: UI_FONT, fontSize: 23, color: COLORS.muted, marginTop: 16, lineHeight: 1.4}}>{text}</div>
    </GlassCard>
  );
};

/** Violet check with a Selected label. progress 0..1 (can overshoot for the pop). */
export const SelectedTick: React.FC<{progress: number}> = ({progress}) => {
  if (progress <= 0.001) return null;
  const s = Math.max(0, progress);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        transform: `scale(${s})`,
        transformOrigin: 'right center',
        opacity: Math.min(1, s),
      }}
    >
      <div
        style={{
          fontFamily: UI_FONT,
          fontWeight: 500,
          fontSize: 20,
          color: COLORS.violet,
          letterSpacing: '0.06em',
        }}
      >
        Selected
      </div>
      <svg width={40} height={40} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="19" fill={COLORS.violet} />
        <path d="M11 21 L17.5 27 L29 14" fill="none" stroke="#F4F4F5" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// ---- Store ---------------------------------------------------------------

/** Store item with a shimmering time-limited effect. sheenX is the sheen position in px. */
export const StoreItem: React.FC<{width: number; sheenX: number; style?: React.CSSProperties}> = ({
  width,
  sheenX,
  style,
}) => (
  <GlassCard style={{width, padding: 30, overflow: 'hidden', position: 'relative', ...style}}>
    <div
      style={{
        height: 300,
        borderRadius: 16,
        background:
          'radial-gradient(circle at 30% 30%, #3A3A4C 0%, #14141C 60%, #0B0B10 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 170,
          height: 170,
          marginLeft: -85,
          marginTop: -85,
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.7)',
          boxShadow: '0 0 40px rgba(255,255,255,0.22), inset 0 0 40px rgba(255,255,255,0.12)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: sheenX,
          width: 220,
          background:
            'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)',
          transform: 'skewX(-14deg)',
        }}
      />
    </div>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 26}}>
      <Title size={44}>Aurora Frame</Title>
    </div>
    <div style={{fontFamily: UI_FONT, fontSize: 22, color: COLORS.muted, marginTop: 8}}>Profile visual effect</div>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22}}>
      <div
        style={{
          fontFamily: UI_FONT,
          fontWeight: 500,
          fontSize: 19,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: COLORS.text,
          border: '1px solid rgba(255,255,255,0.22)',
          borderRadius: 999,
          padding: '8px 16px',
        }}
      >
        Time-limited
      </div>
      <div style={{fontFamily: UI_FONT, fontWeight: 500, fontSize: 26, color: COLORS.text}}>450 AustroPoints</div>
    </div>
  </GlassCard>
);

// ---- Profile / Badges / Squads / DMs -------------------------------------

export const BadgeGlyph: React.FC<{kind: number; size?: number}> = ({kind, size = 64}) => {
  const paths = [
    'M32 6 L40 24 L60 26 L44 39 L49 58 L32 48 L15 58 L20 39 L4 26 L24 24 Z', // star
    'M32 6 L56 16 L54 38 C52 50 44 56 32 60 C20 56 12 50 10 38 L8 16 Z', // shield
    'M8 14 H56 V42 H30 L18 52 V42 H8 Z', // chat
    'M32 58 C18 58 14 48 18 38 C22 30 30 26 28 14 C40 22 46 32 44 42 C48 38 50 34 50 30 C56 36 58 46 52 52 C48 56 40 58 32 58 Z', // flame
    'M36 4 L14 36 H30 L26 60 L50 26 H34 Z', // bolt
    'M32 8 C46 8 56 18 56 32 C56 46 46 56 32 56 C18 56 8 46 8 32 C8 18 18 8 32 8 Z M32 20 L32 32 L40 40', // clock
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64">
      <path d={paths[kind % paths.length]} fill="none" stroke="#F4F4F5" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

export const BadgeTile: React.FC<{label: string; kind: number; size: number; style?: React.CSSProperties}> = ({
  label,
  kind,
  size,
  style,
}) => (
  <GlassCard
    style={{
      width: size,
      height: size,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      ...style,
    }}
  >
    <BadgeGlyph kind={kind} size={size * 0.36} />
    <div style={{fontFamily: UI_FONT, fontWeight: 500, fontSize: 22, color: COLORS.text, textAlign: 'center'}}>{label}</div>
  </GlassCard>
);

export const DMBubble: React.FC<{
  text: string;
  mine?: boolean;
  progress: number; // 0..1 entrance
  style?: React.CSSProperties;
}> = ({text, mine = false, progress, style}) => (
  <div
    style={{
      alignSelf: mine ? 'flex-end' : 'flex-start',
      maxWidth: 520,
      padding: '18px 26px',
      borderRadius: 26,
      borderBottomRightRadius: mine ? 8 : 26,
      borderBottomLeftRadius: mine ? 26 : 8,
      background: mine ? '#F4F4F5' : 'rgba(255,255,255,0.1)',
      color: mine ? '#0B0B10' : COLORS.text,
      border: mine ? 'none' : '1px solid rgba(255,255,255,0.12)',
      fontFamily: UI_FONT,
      fontSize: 26,
      lineHeight: 1.3,
      opacity: Math.min(1, Math.max(0, progress)),
      transform: `translateY(${(1 - Math.min(1, Math.max(0, progress))) * 30}px) scale(${0.9 + 0.1 * Math.min(1.04, Math.max(0, progress))})`,
      transformOrigin: mine ? 'right bottom' : 'left bottom',
      ...style,
    }}
  >
    {text}
  </div>
);
