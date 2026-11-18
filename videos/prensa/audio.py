# Uso: python3 round_audio.py meta.json saida.wav  -- efeitos sinteticos por tema
import json, sys, wave, numpy as np
meta = json.load(open(sys.argv[1])); FPS = 30; SR = 44100; th = meta['theme']
N = int(meta['total'] / FPS * SR) + SR // 2
a = np.zeros(N); rng = np.random.default_rng(17)
def add(sig, t):
    i = max(0, int(t * SR)); j = min(N, i + len(sig)); a[i:j] += sig[:j - i]
lp = lambda x, k: np.convolve(x, np.ones(k) / k, 'same')
def tone(f, d, v, dec): n = int(d * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t / dec) * v
for r in meta['rounds']:
    t0, tc = r['start'] / FPS, r['contact'] / FPS; A = tc - t0
    n = int(A * SR); t = np.arange(n) / SR; p = t / A
    if th == 'prensa':   # zumbido hidraulico subindo
        ph = 2 * np.pi * np.cumsum(60 + 50 * p) / SR
        add((np.sin(ph) + 0.5 * np.sign(np.sin(ph))) * (0.05 + 0.12 * p) + lp(rng.standard_normal(n), 30) * 0.04, t0)
    else:                # chiado da panela + apito subindo
        add(np.diff(rng.standard_normal(n), prepend=0) * (0.02 + 0.22 * p ** 1.5), t0)
        add(np.sin(2 * np.pi * np.cumsum(900 + 1400 * p ** 2) / SR) * 0.08 * p ** 2, t0)
    add(tone(1318, 0.5, 0.22, 0.12) + tone(1976, 0.5, 0.11, 0.12), tc)        # ding
    tb = tc + 1 / FPS; n = int(0.7 * SR); t = np.arange(n) / SR
    add(np.sin(2 * np.pi * (100 * np.exp(-t * 10) + 40) * t) * np.exp(-t / 0.15) * 0.9, tb)
    add(lp(rng.standard_normal(n), 3) * np.exp(-t / 0.05) * 0.6, tb)
    for _ in range(16):
        m = int(0.08 * SR); tm = np.arange(m) / SR
        f = rng.uniform(2500, 6000) if th == 'prensa' else rng.uniform(400, 1200)
        add(np.sin(2 * np.pi * f * tm) * np.exp(-tm / 0.02) * 0.08, tb + 0.05 + rng.uniform(0, 0.5))
for f in meta['events']:
    m = int(0.05 * SR); tm = np.arange(m) / SR
    add((np.sin(2 * np.pi * (180 if th == 'prensa' else 2400) * tm)) * np.exp(-tm / 0.012) * 0.12, f / FPS)
to = meta['outro'] / FPS; n = int(0.5 * SR); t = np.arange(n) / SR
add(lp(rng.standard_normal(n), 30) * np.sin(np.pi * t / 0.5) * 0.6, to)
a = a / np.max(np.abs(a)) * 0.89
with wave.open(sys.argv[2], 'wb') as fw:
    fw.setnchannels(1); fw.setsampwidth(2); fw.setframerate(SR); fw.writeframes((a * 32767).astype(np.int16).tobytes())
