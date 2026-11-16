# Uso: python3 audio.py meta.json saida.wav   -- trilha chiptune original + efeitos
import json, sys, wave, numpy as np
meta = json.load(open(sys.argv[1])); FPS = 30; SR = 44100
END = meta['total'] / FPS; N = int(END * SR) + SR // 2
sfx = np.zeros(N); mus = np.zeros(N); rng = np.random.default_rng(8)
def put(buf, sig, t):
    i = max(0, int(t * SR)); j = min(N, i + len(sig)); buf[i:j] += sig[:j - i]
def sq(f, d, v=0.2, duty=0.5, dec=None):
    n = int(d * SR); t = np.arange(n) / SR
    w = np.where((t * f) % 1 < duty, 1.0, -1.0)
    e = np.exp(-t / dec) if dec else np.minimum(1, (d - t) / 0.01)
    return w * e * v
def tri(f, d, v=0.2):
    n = int(d * SR); t = np.arange(n) / SR; return (2 * np.abs(2 * ((t * f) % 1) - 1) - 1) * v * np.minimum(1, (d - t) / 0.01)
def noise(d, v, dec): n = int(d * SR); return rng.standard_normal(n) * np.exp(-np.arange(n) / SR / dec) * v
mid = lambda m: 440 * 2 ** ((m - 69) / 12)
H0, CLUE, VOTE = meta['hook'] / FPS, meta['clue'] / FPS, meta['vote'] / FPS
SUS0 = meta['cursor'][0] / FPS if meta['cursor'] else CLUE - 3
# --- gancho: varredura de "liga" + glitch + acorde dramatico
n = int(0.5 * SR); t = np.arange(n) / SR
put(sfx, np.where((t * (200 + 1200 * t)) % 1 < 0.5, 1, -1) * 0.12 * (1 - t / 0.5), 0)
for k, m in enumerate([57, 60, 64]): put(sfx, sq(mid(m), 0.5, 0.09, 0.25, 0.25), 0.05 + k * 0.08)
put(sfx, noise(0.18, 0.25, 0.05), H0 - 0.18)
# --- musica (150 bpm, semicolcheias de 0.1 s)
chords = [(57, 60, 64), (53, 57, 60), (60, 64, 67), (55, 59, 62)]
bass = [45, 41, 48, 43]
lead = [(0, 2, 12), (3, 1, 12), (6, 0, 12), (8, 2, 12), (10, 1, 12), (12, 0, 24)]  # (passo, nota do acorde, oitava)
step = 0.1; t = H0; s = 0
while t < END:
    c = (s // 16) % 4; ch = chords[c]
    if s % 2 == 0: put(mus, tri(mid(bass[c] + (12 if s % 4 == 2 else 0)), step * 1.9, 0.22), t)
    put(mus, sq(mid(ch[s % 3] + 12), step * 0.9, 0.035, 0.125), t)
    for st, idx, octv in lead:
        if s % 16 == st and not (VOTE - 0.2 < t < VOTE + 1.2): put(mus, sq(mid(ch[idx] + octv), step * 1.6, 0.07, 0.5), t)
    if SUS0 <= t < CLUE: put(mus, noise(0.03, 0.06, 0.008), t)          # chimbal no suspense
    t += step; s += 1
# a musica "pausa" na pista
mask = np.ones(N); i0, i1 = int(CLUE * SR), int((CLUE + 0.4) * SR); mask[i0:i1] = 0
mus *= mask
# --- efeitos
put(sfx, sq(1046.5, 0.08, 0.12, 0.5, 0.05), CLUE); put(sfx, sq(1318.5, 0.12, 0.12, 0.5, 0.06), CLUE + 0.08)   # som de pause
for f in meta['coins']:
    if f < 9000: put(sfx, sq(988, 0.05, 0.1), f / FPS); put(sfx, sq(1319, 0.12, 0.1, 0.5, 0.05), f / FPS + 0.05)
for f in meta['type']: put(sfx, sq(620, 0.018, 0.035, 0.5), f / FPS)
for f in meta['cursor']: put(sfx, sq(880, 0.04, 0.08, 0.25), f / FPS)
for k, f in enumerate(meta['count']): put(sfx, sq(523 if k < 2 else 1046, 0.12, 0.14, 0.5, 0.08), f / FPS)
for k, m in enumerate([60, 64, 67, 72, 76]): put(sfx, sq(mid(m), 0.16, 0.1, 0.25, 0.12), VOTE + k * 0.07)
for f in meta['voteCursor'][1:]:
    if f / FPS < END: put(sfx, sq(660, 0.03, 0.05, 0.25), f / FPS)
a = mus * 0.8 + sfx
a = a / np.max(np.abs(a)) * 0.89
with wave.open(sys.argv[2], 'wb') as fw:
    fw.setnchannels(1); fw.setsampwidth(2); fw.setframerate(SR); fw.writeframes((a * 32767).astype(np.int16).tobytes())
