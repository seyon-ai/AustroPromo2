# AustroClash Promo (Remotion)

A ~56 second launch promo for AustroClash, built with [Remotion](https://www.remotion.dev/).
Composition ids:

- `AustroClashPromo` (1920×1080, 30 fps, landscape, the main cut)
- `AustroClashPromoVertical` (1080×1920, working reuse of the same scenes, not re-laid-out)

## Render it (no local render needed)

**Automatic:** every push to `main` runs `.github/workflows/render.yml` and renders the landscape MP4.

**Manual:** Actions → **Render Promo** → **Run workflow**. You can pick the composition id.
Manual runs also render the vertical MP4.

**Download:** open the workflow run → **Artifacts** → `austroclash-promo` (kept 14 days).

## Change the script or voiceover

1. Edit the line in the VO clip, or replace the file in `public/vo/01.mp3` … `08.mp3`.
   Scene 01–08 map to the clip with the same number.
2. Normalize the new clip (the project targets about −16 LUFS):
   ```bash
   ffmpeg -y -i new.mp3 -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 44100 -ac 2 -b:a 192k public/vo/01.mp3
   ```
3. Recompute the timing. Scene lengths and every SFX/visual hit are derived from the VO durations:
   ```bash
   npm run build:timing      # rewrites src/timing.ts from ffprobe durations
   ```
4. If you change the wording, also adjust the word-timed hits in the matching scene file
   (`src/scenes/Scene0N.tsx`). Those values come from silence analysis of the clip.

## Swap the placeholder URL

The final lockup reads one constant. Edit `SITE_URL` in `src/theme.ts`:

```ts
export const SITE_URL = 'austroclash.com';
```

## Project layout

```
src/Root.tsx            Composition registry (landscape + vertical)
src/Promo.tsx           Scene sequencing, VO placement, music ducking, grain
src/timing.ts           GENERATED from VO durations by scripts/build-timing.mjs
src/theme.ts            Palette, fonts (@remotion/google-fonts), SITE_URL
src/anim.ts             Pure-frame helpers (tween, keys, sp, rnd)
src/components/         Logo (animatable SVG parts), GlassCard, WordReveal, Grain, Backdrop,
                        VoteBar, Counter, CrownBadge, Particles, Sfx, UI mockups
src/scenes/Scene01–08   One file per scene
public/vo/              Voiceover, one MP3 per scene
public/sfx/             Synthesized SFX (whoosh, impact, tick, pop, shimmer)
public/music.wav        Music bed (96 beats @ 100 BPM, seamless loop)
public/logo*.png        Logo raster (black on white, white on transparent)
scripts/                make_logo.py, make_sfx_music.py, build-timing.mjs
```

Everything on screen is a pure function of the current frame. There are no CSS transitions, keyframes,
timers, or Framer Motion.

## Re-generate the assets

```bash
pip install numpy pillow
python3 scripts/make_logo.py         # public/logo.png, public/logo-white.png
python3 scripts/make_sfx_music.py    # public/sfx/*.wav, public/music.wav
npm run build:timing                 # src/timing.ts
```

## Local preview (optional)

```bash
npm ci
npm run studio                       # Remotion Studio
```

## Notes

- The logo in `public/` is a geometric recreation of the attached mark. It matches
  `src/components/Logo.tsx`. Replace `public/logo.png` with the original and re-run
  `scripts/make_logo.py` if you need the exact artwork.
- Copy and claims come only from the product brief. Avatars, names, and posts in the UI
  mockups are placeholders.
