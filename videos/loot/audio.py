# Uso: python3 audio.py meta.json saida.wav  -- trilha chiptune original + efeitos
import json, sys, wave, numpy as np
meta = json.load(open(sys.argv[1])); FPS = 30; SR = 44100
END = meta['total'] / FPS; N = int(END * SR) + SR // 2
sfx = np.zeros(N); mus = np.zeros(N); rng = np.random.default_rng(12)
def put(buf, sig, t):
    i = max(0, int(t * SR)); j = min(N, i + len(sig)); buf[i:j] += sig[:j - i]
def sq(f, d, v=0.2, duty=0.5, dec=None):
    n = int(d * SR); t = np.arange(n) / SR; w = np.where((t * f) % 1 < duty, 1.0, -1.0)
    return w * (np.exp(-t / dec) if dec else np.minimum(1, (d - t) / 0.01)) * v
def tri(f, d, v=0.2):
    n = int(d * SR); t = np.arange(n) / SR; return (2 * np.abs(2 * ((t * f) % 1) - 1) - 1) * v * np.minimum(1, (d - t) / 0.01)
def noise(d, v, dec): n = int(d * SR); return rng.standard_normal(n) * np.exp(-np.arange(n) / SR / dec) * v
mid = lambda m: 440 * 2 ** ((m - 69) / 12)
H0, REEL, ENDF, MY = meta['hook'] / FPS, meta['reel'] / FPS, meta['end'] / FPS, meta['mythic'] / FPS
# gancho: varredura + acorde + glitch
n = int(0.5 * SR); t = np.arange(n) / SR
put(sfx, np.where((t * (300 + 1400 * t)) % 1 < 0.5, 1, -1) * 0.1 * (1 - t / 0.5), 0)
for k, m in enumerate([60, 64, 67, 72]): put(sfx, sq(mid(m), 0.4, 0.08, 0.25, 0.2), 0.05 + k * 0.07)
put(sfx, noise(0.18, 0.25, 0.05), H0 - 0.18)
# bau abrindo: arpejo de fanfarra
for k, m in enumerate([67, 72, 76, 79, 84]): put(sfx, sq(mid(m), 0.18, 0.11, 0.25, 0.12), H0 + 0.05 + k * 0.06)
# musica: 170 bpm, semicolcheia ~0.088 s, progressao C - G - Am - F
chords = [(60, 64, 67), (55, 59, 62), (57, 60, 64), (53, 57, 60)]; bass = [48, 43, 45, 41]
lead = [(0, 2), (2, 1), (4, 2), (6, 0), (8, 1), (10, 2), (12, 0), (14, 1)]
step = 60 / 170 / 4; t = REEL; s = 0
while t < END:
    c = (s // 16) % 4; ch = chords[c]
    if s % 2 == 0: put(mus, tri(mid(bass[c] + (12 if s % 4 == 2 else 0)), step * 1.9, 0.22), t)
    put(mus, sq(mid(ch[s % 3] + 24), step * 0.8, 0.03, 0.125), t)
    for st, idx in lead:
        if s % 16 == st and (s // 32) % 2 == 1: put(mus, sq(mid(ch[idx] + 12), step * 1.7, 0.06, 0.5), t)
    if s % 4 == 2: put(mus, noise(0.03, 0.05, 0.008), t)
    t += step; s += 1
# tiques da roleta a cada troca de item
for f in meta['changes']:
    r = meta['rarity'].get(str(f), 'C')
    put(sfx, sq({'C': 900, 'R': 1100, 'E': 1250, 'L': 1500, 'M': 600, 'X': 2000}[r], 0.014, 0.05, 0.25), f / FPS)
# brilho sutil no frame mitico
for k, m in enumerate([84, 88, 91, 96]): put(sfx, sq(mid(m), 0.1, 0.06, 0.25, 0.06), MY + k * 0.035)
# final: fanfarra
for k, m in enumerate([72, 76, 79, 84, 79, 84]): put(sfx, sq(mid(m), 0.15, 0.1, 0.5, 0.1), ENDF + k * 0.08)
a = mus * 0.8 + sfx
a = a / np.max(np.abs(a)) * 0.89
with wave.open(sys.argv[2], 'wb') as fw:
    fw.setnchannels(1); fw.setsampwidth(2); fw.setframerate(SR); fw.writeframes((a * 32767).astype(np.int16).tobytes())
