# Uso: python3 audio.py meta.json saida.wav
import json, sys, wave, numpy as np
meta = json.load(open(sys.argv[1])); FPS = 30; SR = 44100
N = int(meta['total'] / FPS * SR) + SR // 2
a = np.zeros(N); rng = np.random.default_rng(5)
def add(sig, t):
    i = max(0, int(t * SR)); j = min(N, i + len(sig)); a[i:j] += sig[:j - i]
play = meta['play'] / FPS
# batida acelerando (bumbo + chimbal)
t, beat = 0.0, 0
while t < play:
    bpm = 118 + 50 * (t / play); step = 60 / bpm / 2
    if beat % 2 == 0:
        n = int(0.25 * SR); tt = np.arange(n) / SR
        add(np.sin(2 * np.pi * (55 + 90 * np.exp(-tt * 30)) * tt) * np.exp(-tt / 0.09) * 0.55, t)
    n = int(0.04 * SR); tt = np.arange(n) / SR
    add(np.diff(rng.standard_normal(n), prepend=0) * np.exp(-tt / 0.008) * 0.08, t)
    t += step; beat += 1
# tom guia: frequencia segue a pontuacao de cada frame
sc = np.array(meta['scores'], float)
ts = np.arange(int(play * SR)) / SR
s_interp = np.interp(ts * FPS, np.arange(len(sc)), sc)
f = 180 + 7.5 * s_interp
ph = 2 * np.pi * np.cumsum(f) / SR
vol = np.where(s_interp > 0, 0.05 + 0.10 * (s_interp / 100) ** 2, 0.02)
add((np.sin(ph) + 0.25 * np.sin(2 * ph)) * vol, 0)
# ding duplo no frame perfeito
tp = meta['perfect'] / FPS; n = int(0.7 * SR); tt = np.arange(n) / SR
add((np.sin(2 * np.pi * 1568 * tt) + 0.6 * np.sin(2 * np.pi * 2093 * tt)) * np.exp(-tt / 0.18) * 0.3, tp)
# whoosh no final
to = play; n = int(0.5 * SR); tt = np.arange(n) / SR
add(np.convolve(rng.standard_normal(n), np.ones(30) / 30, 'same') * np.sin(np.pi * tt / 0.5) * 0.6, to)
a = a / np.max(np.abs(a)) * 0.89
with wave.open(sys.argv[2], 'wb') as fw:
    fw.setnchannels(1); fw.setsampwidth(2); fw.setframerate(SR); fw.writeframes((a * 32767).astype(np.int16).tobytes())
