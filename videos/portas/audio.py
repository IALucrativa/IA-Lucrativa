# Uso: python3 audio.py meta.json saida.wav
import json, sys, wave, numpy as np
meta = json.load(open(sys.argv[1])); FPS = 30; SR = 44100; M = meta['marks']
N = int(meta['total'] / FPS * SR) + SR // 2
a = np.zeros(N); rng = np.random.default_rng(3)
def add(sig, t):
    i = max(0, int(t * SR)); j = min(N, i + len(sig)); a[i:j] += sig[:j - i]
def env(n, d): return np.exp(-np.arange(n) / SR / d)
def tone(f, d, v, dec):
    n = int(d * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t / dec) * v
lp = lambda x, k: np.convolve(x, np.ones(k) / k, 'same')
# abertura: whoosh + impacto
n = int(0.6 * SR); t = np.arange(n) / SR
add(lp(rng.standard_normal(n), 25) * (t / 0.6) ** 2 * 0.5, -0.0)
add(tone(55, 0.6, 0.8, 0.2) + lp(rng.standard_normal(n), 4) * env(n, 0.04) * 0.4, 0.45)
# portas subindo: baque grave
for f in M['doors']: add(tone(70, 0.4, 0.7, 0.12) + lp(rng.standard_normal(int(0.4 * SR)), 8) * env(int(0.4 * SR), 0.05) * 0.3, (f + 12) / FPS)
# passinhos
for k in range(8): add(lp(rng.standard_normal(int(0.05 * SR)), 6) * env(int(0.05 * SR), 0.01) * 0.25, (M['pig'] + k * 4.5) / FPS)
# pop das pistas
for f in M['hints']:
    n = int(0.15 * SR); t = np.arange(n) / SR
    add(np.sin(2 * np.pi * (500 + 2500 * t) * t) * np.exp(-t / 0.04) * 0.3, f / FPS)
# coracao acelerando + clique do holofote
cyc, vote = M['cycle'] / FPS, M['vote'] / FPS
t = cyc
while t < vote:
    p = (t - cyc) / (vote - cyc); bpm = 70 + 90 * p
    add(tone(48, 0.25, 0.7, 0.07), t); add(tone(44, 0.25, 0.5, 0.06), t + 0.16)
    t += 60 / bpm
for s in meta['spot']: add(tone(1800, 0.05, 0.12, 0.01), s['f'] / FPS)
# drone de tensao
n = int((vote - cyc) * SR); tt = np.arange(n) / SR; p = tt / (vote - cyc)
add((np.sin(2 * np.pi * (110 + 40 * p) * tt) + np.sin(2 * np.pi * (110.7 + 40 * p) * tt)) * 0.04 * (0.4 + p), cyc)
# bipes do medidor: a cada 10% ate 90, depois a cada 1%
m = meta['meter']; last = -1
for f, pc in enumerate(m[:-1]):
    step = pc // 10 if pc < 90 else 9 + (pc - 89)
    if step != last and pc > 0:
        add(tone(700 + pc * 9, 0.08, 0.16 if pc < 90 else 0.22, 0.025), f / FPS); last = step
# zap do raio-X no frame 100%
tz = meta['spoiler'] / FPS; n = int(0.25 * SR); tt = np.arange(n) / SR
add(np.sin(2 * np.pi * (2400 - 6000 * tt) * tt) * np.exp(-tt / 0.08) * 0.35 + rng.standard_normal(n) * np.exp(-tt / 0.03) * 0.15, tz)
# acorde da votacao + pad
for fq in (261.6, 329.6, 392.0, 523.3): add(tone(fq, 1.6, 0.16, 0.5), vote)
n = int((meta['total'] / FPS - vote) * SR); tt = np.arange(n) / SR
pad = sum(np.sin(2 * np.pi * fq * tt) for fq in (130.8, 196.0, 261.6)) * 0.035 * np.minimum(tt / 0.5, 1)
add(pad, vote)
a = a / np.max(np.abs(a)) * 0.89
with wave.open(sys.argv[2], 'wb') as fw:
    fw.setnchannels(1); fw.setsampwidth(2); fw.setframerate(SR); fw.writeframes((a * 32767).astype(np.int16).tobytes())
