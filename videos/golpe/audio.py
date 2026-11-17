# Uso: python3 audio.py meta.json saida.wav  -- trilha synthwave original + efeitos
import json, sys, wave, numpy as np
meta = json.load(open(sys.argv[1])); FPS = 30; SR = 44100
END = meta['total'] / FPS; N = int(END * SR) + SR // 2
sfx = np.zeros(N); mus = np.zeros(N); rng = np.random.default_rng(21)
def put(buf, sig, t):
    i = max(0, int(t * SR)); j = min(N, i + len(sig)); buf[i:j] += sig[:j - i]
def saw(f, d, v, dec=None):
    n = int(d * SR); t = np.arange(n) / SR; w = 2 * ((t * f) % 1) - 1
    e = np.exp(-t / dec) if dec else np.minimum(1, (d - t) / 0.02)
    return np.convolve(w, np.ones(6) / 6, 'same') * e * v
def sine(f, d, v, dec): n = int(d * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t / dec) * v
def noise(d, v, dec): n = int(d * SR); return rng.standard_normal(n) * np.exp(-np.arange(n) / SR / dec) * v
mid = lambda m: 440 * 2 ** ((m - 69) / 12)
H0, BOARD, CLUE, VOTE = meta['hook'] / FPS, meta['board'] / FPS, meta['clue'] / FPS, meta['vote'] / FPS
# sirene no gancho
n = int(H0 * SR); t = np.arange(n) / SR
put(sfx, np.sin(2 * np.pi * np.cumsum(700 + 250 * np.sin(2 * np.pi * 1.6 * t)) / SR) * 0.13, 0)
put(sfx, sine(55, 0.8, 0.9, 0.3) + noise(0.8, 0.3, 0.05), 0)
put(sfx, np.convolve(rng.standard_normal(int(0.4 * SR)), np.ones(25) / 25, 'same') * (np.arange(int(0.4 * SR)) / SR / 0.4) ** 2 * 0.6, H0 - 0.4)
# motor durante a direcao
d0, d1 = meta['drive'][0] / FPS, meta['drive'][1] / FPS; n = int((d1 - d0 + 0.6) * SR); t = np.arange(n) / SR
eng = np.sin(2 * np.pi * np.cumsum(70 + 8 * np.sin(2 * np.pi * 0.7 * t)) / SR); eng = np.sign(eng) * 0.4 + eng
put(sfx, np.convolve(eng, np.ones(30) / 30, 'same') * 0.06 * np.minimum(1, (d1 - d0 + 0.6 - t) / 0.6), d0)
# musica: 108 bpm, Dm - Bb - F - C
chords = [(62, 65, 69), (58, 62, 65), (65, 69, 72), (60, 64, 67)]; bass = [38, 34, 41, 36]
beat = 60 / 108; step = beat / 4; t0 = H0; s = 0
while t0 + s * step < END:
    t = t0 + s * step; c = (s // 16) % 4; ch = chords[c]
    if s % 2 == 0: put(mus, saw(mid(bass[c]), step * 1.8, 0.16, 0.12), t)
    put(mus, saw(mid(ch[(s // 2) % 3] + 12), step * 0.9, 0.035, 0.05), t)
    if s % 4 == 0: put(mus, sine(50, 0.3, 0.6, 0.08), t)                          # bumbo
    if s % 8 == 4: put(mus, noise(0.25, 0.22, 0.07), t)                          # caixa
    if s % 2 == 1: put(mus, noise(0.03, 0.05, 0.006), t)                         # chimbal
    if s % 16 == 0:                                                              # pad
        for m in ch: put(mus, saw(mid(m), beat * 4, 0.025), t)
    s += 1
mask = np.ones(N); mask[int(CLUE * SR):int((CLUE + 0.35) * SR)] = 0.15; mus *= mask
# bipes do hacker, ciclo, contagem
for f in meta['beeps']: put(sfx, sine(1200 + 8 * (f - meta['board']), 0.06, 0.12, 0.02), f / FPS)
for f in meta['cycle']: put(sfx, noise(0.05, 0.12, 0.01), f / FPS)
for k, f in enumerate(meta['count']): put(sfx, sine(660 if k < 2 else 1320, 0.2, 0.25, 0.08), f / FPS)
# camera hackeada: chiado + bipe
put(sfx, noise(0.06, 0.3, 0.04), CLUE); put(sfx, sine(1800, 0.12, 0.15, 0.04), CLUE + 0.02)
# votacao: acorde + sirene ao longe
for k, m in enumerate([62, 65, 69, 74]): put(sfx, saw(mid(m), 0.6, 0.06, 0.4), VOTE + k * 0.05)
n = int((END - VOTE) * SR); t = np.arange(n) / SR
put(sfx, np.sin(2 * np.pi * np.cumsum(650 + 200 * np.sin(2 * np.pi * 1.2 * t)) / SR) * 0.04 * np.minimum(1, t / 1.0), VOTE)
a = mus * 0.85 + sfx
a = a / np.max(np.abs(a)) * 0.89
with wave.open(sys.argv[2], 'wb') as fw:
    fw.setnchannels(1); fw.setsampwidth(2); fw.setframerate(SR); fw.writeframes((a * 32767).astype(np.int16).tobytes())
