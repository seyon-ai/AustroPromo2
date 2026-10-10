import {loadFont as loadSpaceGrotesk} from '@remotion/google-fonts/SpaceGrotesk';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';

// Fonts are loaded through @remotion/google-fonts (never a <link> tag).
export const HEADLINE_FONT = loadSpaceGrotesk('normal', {
  weights: ['700'],
  subsets: ['latin'],
}).fontFamily;

export const UI_FONT = loadInter('normal', {
  weights: ['400', '500'],
  subsets: ['latin'],
}).fontFamily;

export const COLORS = {
  bg0: '#07070A',
  bg1: '#111118',
  text: '#F4F4F5',
  muted: 'rgba(244,244,245,0.58)',
  faint: 'rgba(244,244,245,0.3)',
  gold: '#F5C542', // King / victory / highlights only
  violet: '#7C5CFF', // VAR / tech / links only
};

export const GLASS = {
  fill: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  blur: 'blur(20px)',
  radius: 20,
};

// Placeholder domain for the final lockup. Change this one constant to swap it.
export const SITE_URL = 'austroclash.in';

export const TRACKING_HEADLINE = '-0.03em';
