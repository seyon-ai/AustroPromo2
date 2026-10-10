"""
Synthesizes the AustroClash SFX set and the music bed with numpy only.
Outputs (44.1 kHz, 16-bit mono WAV):
  public/sfx/whoosh.wav   0.35 s  band-pass noise sweep 200 -> 4000 Hz
  public/sfx/impact.wav   0.60 s  50 Hz thump with pitch drop + noise burst
  public/sfx/tick.wav     0.05 s  short click for counters
  public/sfx/pop.wav      0.15 s  sine blip 600 -> 900 Hz
  public/sfx/shimmer.wav  0.80 s  detuned high sines, slow fade
  public/music.wav        96 beats @ 100 BPM (57.6 s) seamless loop
Run: python3 scripts/make_sfx_music.py
"""
import os
import wave
import numpy as np

SR = 44100
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_SFX = os.path.join(ROOT, "public", "sfx")
os.makedirs(OUT_SFX, exist_ok=True)
rng = np.random.default_rng(7)


def write_wav(path, x, peak=0.85):
    x = np.asarray(x, dtype=np.float64)
    m = np.max(np.abs(x)) or 1.0
    x = x / m * peak
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print("wrote", path, f"{len(x) / SR:.3f}s")


def t_of(sec):
    return np.arange(int(sec * SR)) / SR


def bandpass_sweep(noise, f_start, f_end, width=0.18, hop=128, win=1024):
    """Time-varying band-pass via STFT masking (overlap-add)."""
    n = len(noise)
    out = np.zeros(n + win)
    window = np.hanning(win)
    norm = np.zeros(n + win)
    freqs = np.fft.rfftfreq(win, 1 / SR)
    for start in range(0, n, hop):
        frac = start / max(1, n - 1)
        fc = f_start * (f_end / f_start) ** frac  # log sweep
        mask = np.exp(-0.5 * ((np.log(freqs + 1) - np.log(fc)) / width) ** 2)
        seg = noise[start:start + win]
        if len(seg) < win:
            seg = np.pad(seg, (0, win - len(seg)))
        spec = np.fft.rfft(seg * window) * mask
        frame = np.fft.irfft(spec, win)
        out[start:start + win] += frame * window
        norm[start:start + win] += window ** 2
    out = out[:n] / np.maximum(norm[:n], 1e-6)
    return out


def make_whoosh():
    d = 0.35
    n = int(d * SR)
    noise = rng.standard_normal(n)
    x = bandpass_sweep(noise, 200, 4000, width=0.35)
    t = t_of(d)
    env = np.minimum(t / 0.04, 1.0) * np.exp(-t * 7.0)  # fast attack, decay
    write_wav(os.path.join(OUT_SFX, "whoosh.wav"), x * env)


def make_impact():
    d = 0.6
    t = t_of(d)
    f = 50 * np.exp(-t * 6.0) + 30  # pitch drop 80 -> 30 Hz
    phase = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(phase) * np.exp(-t * 7.5)
    burst_n = int(0.03 * SR)
    burst = np.zeros_like(t)
    burst[:burst_n] = rng.standard_normal(burst_n) * np.linspace(1, 0, burst_n) ** 2
    hp = np.diff(burst, prepend=0)  # cheap high-pass to give the crack
    x = np.tanh(2.2 * body) + 0.35 * hp
    write_wav(os.path.join(OUT_SFX, "impact.wav"), x)


def make_tick():
    d = 0.05
    t = t_of(d)
    click = rng.standard_normal(len(t)) * np.exp(-t * 180)
    tone = np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 120)
    write_wav(os.path.join(OUT_SFX, "tick.wav"), 0.6 * click + 0.4 * tone, peak=0.6)


def make_pop():
    d = 0.15
    t = t_of(d)
    f = 600 + (900 - 600) * (t / d)
    phase = 2 * np.pi * np.cumsum(f) / SR
    env = np.minimum(t / 0.006, 1.0) * np.exp(-t * 22)
    write_wav(os.path.join(OUT_SFX, "pop.wav"), np.sin(phase) * env)


def make_shimmer():
    d = 0.8
    t = t_of(d)
    x = np.zeros_like(t)
    for f, a in [(1318.5, 1.0), (1321.7, 0.8), (1980.0, 0.5), (2637.0, 0.35), (3951.0, 0.12)]:
        x += a * np.sin(2 * np.pi * f * t)
    env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.6  # slow swell and fade
    shimmer_am = 0.75 + 0.25 * np.sin(2 * np.pi * 9 * t)
    write_wav(os.path.join(OUT_SFX, "shimmer.wav"), x * env * shimmer_am)


def saw(freq, t, harmonics=24):
    out = np.zeros_like(t)
    for k in range(1, harmonics + 1):
        if freq * k > 12000:
            break
        out += np.sin(2 * np.pi * freq * k * t) / k
    return out * (2 / np.pi)


def one_pole_lowpass(x, cutoff):
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc)
        y[i] = acc
    return y


def make_music():
    bpm = 100
    beat = 60.0 / bpm
    beats = 96  # 24 bars = 3 full 4-chord cycles of 8 beats each -> seamless loop
    total = beats * beat
    n = int(total * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)

    # Am -> F -> C -> G, two bars (8 beats) each
    notes = {
        "Am": [110.00, 130.81, 164.81],  # A2 C3 E3
        "F": [87.31, 130.81, 174.61],    # F2 C3 F3
        "C": [130.81, 164.81, 196.00],   # C3 E3 G3
        "G": [98.00, 146.83, 196.00],    # G2 D3 G3
    }
    chords = ["Am", "F", "C", "G"]

    # Pad: two detuned saws low-passed, per chord (computed per chord segment)
    pad = np.zeros(n)
    for ci in range(beats // 8):
        chord = chords[ci % 4]
        s = int(ci * 8 * beat * SR)
        e = min(n, int((ci + 1) * 8 * beat * SR))
        seg_t = np.arange(e - s) / SR
        seg = np.zeros(e - s)
        for f in notes[chord]:
            seg += saw(f * 0.998, seg_t) + saw(f * 1.002, seg_t)
        seg = one_pole_lowpass(seg / 6, 900)
        fade = np.minimum(seg_t / 0.4, 1) * np.minimum((e - s - np.arange(e - s)) / SR / 0.4, 1)
        pad[s:e] = seg * fade * 0.28
    out += pad

    # Sub-bass pulse on every beat (dark kick-like sine, pitch drop)
    for b in range(beats):
        s = int(b * beat * SR)
        L = int(0.32 * SR)
        e = min(n, s + L)
        tt = np.arange(e - s) / SR
        root = 55.0 if chords[(b // 8) % 4] in ("Am", "C") else (43.65 if chords[(b // 8) % 4] == "F" else 49.0)
        f = root * (1 + 0.8 * np.exp(-tt * 30))
        sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
        out[s:e] += 0.55 * sub

    # Light hi-hat on the off-beats (8th-note offbeats)
    for b in range(beats):
        s = int((b + 0.5) * beat * SR)
        L = int(0.05 * SR)
        e = min(n, s + L)
        tt = np.arange(e - s) / SR
        hat = rng.standard_normal(e - s) * np.exp(-tt * 110)
        hat = np.diff(hat, prepend=0)
        out[s:e] += 0.07 * hat

    # Gentle tail-to-head glue so the loop boundary has no click
    fade_len = int(0.02 * SR)
    out[:fade_len] *= np.linspace(0, 1, fade_len)
    out[-fade_len:] *= np.linspace(1, 0, fade_len)

    write_wav(os.path.join(ROOT, "public", "music.wav"), out, peak=0.75)


if __name__ == "__main__":
    make_whoosh()
    make_impact()
    make_tick()
    make_pop()
    make_shimmer()
    make_music()
