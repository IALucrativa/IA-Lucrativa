# Uso: python3 audio.py meta.json saida.wav
import json, sys, wave, numpy as np
meta = json.load(open(sys.argv[1])); FPS = 30; SR = 44100
N = int(meta['total'] / FPS * SR) + SR // 2
a = np.zeros(N); rng = np.random.default_rng(23)
def add(sig, t):
    i = max(0, int(t * SR)); j = min(N, i + len(sig)); a[i:j] += sig[:j - i]
def lp(x, k): return np.convolve(x, np.ones(k) / k, 'same')
# estalo de elastico: "twang" curto
for f in meta['snaps']:
    n = int(0.09 * SR); t = np.arange(n) / SR; fq = rng.uniform(320, 520)
    tw = np.sin(2 * np.pi * fq * (1 - 0.3 * t / 0.09) * t) * np.exp(-t / 0.025)
    add(tw * 0.22 + rng.standard_normal(n) * np.exp(-t / 0.003) * 0.15, f / FPS)
for r in meta['rounds']:
    t0, tc = r['start'] / FPS, r['contact'] / FPS; A = tc - t0
    # rangido da casca: ruido grave crescendo
    n = int(A * SR); t = np.arange(n) / SR; p = t / A
    cr = lp(rng.standard_normal(n), 40) * (1 + 0.8 * np.sign(np.sin(2 * np.pi * (20 + 40 * p) * t)))
    add(cr * (0.02 + 0.5 * p ** 3), t0)
    n = int(0.5 * SR); t = np.arange(n) / SR   # ding
    tb = tc + 1 / FPS; n = int(0.7 * SR); t = np.arange(n) / SR   # explosao molhada
    add(np.sin(2 * np.pi * (110 * np.exp(-t * 10) + 40) * t) * np.exp(-t / 0.12) * 0.9, tb)
    add(lp(rng.standard_normal(n), 3) * np.exp(-t / 0.05) * 0.7, tb)
    add(lp(rng.standard_normal(n), 12) * np.exp(-t / 0.25) * 0.35, tb + 0.03)
    for _ in range(14):  # respingos
        m = int(0.06 * SR); tm = np.arange(m) / SR; fq = rng.uniform(500, 1400)
        add(np.sin(2 * np.pi * fq * (1 + 4 * tm) * tm) * np.exp(-tm / 0.015) * 0.12, tb + 0.15 + rng.uniform(0, 0.5))
to = meta['outro'] / FPS; n = int(0.5 * SR); t = np.arange(n) / SR
add(lp(rng.standard_normal(n), 30) * np.sin(np.pi * t / 0.5) * 0.6, to)
a = a / np.max(np.abs(a)) * 0.89
with wave.open(sys.argv[2], 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((a * 32767).astype(np.int16).tobytes())
