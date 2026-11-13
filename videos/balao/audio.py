# Uso: python3 audio.py meta.json saida.wav
import json, sys, wave, numpy as np
meta = json.load(open(sys.argv[1])); FPS = 30; SR = 44100
N = int(meta['total'] / FPS * SR) + SR // 2
a = np.zeros(N); rng = np.random.default_rng(11)
def add(sig, t):
    i = int(t * SR); j = min(N, i + len(sig)); a[i:j] += sig[:j - i]
def lp(x, k): return np.convolve(x, np.ones(k) / k, 'same')
# bombadas: "fssh" de ar
for f in meta['pumps']:
    n = int(0.16 * SR); t = np.arange(n) / SR
    add(lp(rng.standard_normal(n), 6) * np.sin(np.pi * t / 0.16) ** 2 * 0.35, f / FPS - 0.05)
for r in meta['rounds']:
    t0, tc = r['start'] / FPS, r['contact'] / FPS; A = tc - t0
    # borracha esticando: rangido que sobe de tom e de volume
    n = int(A * SR); t = np.arange(n) / SR; p = t / A
    fr = 180 + 520 * p ** 2 + 25 * np.sin(2 * np.pi * 13 * t); ph = 2 * np.pi * np.cumsum(fr) / SR
    sq = np.sign(np.sin(ph)) * 0.3 + np.sin(ph)
    add(lp(sq, 4) * (0.01 + 0.09 * p ** 2), t0)
    # ding
    n = int(0.5 * SR); t = np.arange(n) / SR
    add((np.sin(2 * np.pi * 1318 * t) + 0.5 * np.sin(2 * np.pi * 1976 * t)) * np.exp(-t / 0.12) * 0.22, tc)
    # estouro
    tb = tc + 1 / FPS; n = int(0.5 * SR); t = np.arange(n) / SR
    add(rng.standard_normal(n) * np.exp(-t / 0.012) * 1.0, tb)
    add(np.sin(2 * np.pi * (140 * np.exp(-t * 18) + 45) * t) * np.exp(-t / 0.06) * 0.6, tb)
    add(np.diff(rng.standard_normal(n), prepend=0) * np.exp(-t / 0.15) * 0.12, tb + 0.02)  # confete
    for _ in range(10):  # moedas
        m = int(0.12 * SR); tm = np.arange(m) / SR; fq = rng.uniform(2600, 5200)
        add((np.sin(2 * np.pi * fq * tm) + 0.6 * np.sin(2 * np.pi * fq * 1.48 * tm)) * np.exp(-tm / 0.03) * 0.07, tb + 0.08 + rng.uniform(0, 0.5))
to = meta['outro'] / FPS; n = int(0.5 * SR); t = np.arange(n) / SR
add(lp(rng.standard_normal(n), 30) * np.sin(np.pi * t / 0.5) * 0.6, to)
a = a / np.max(np.abs(a)) * 0.89
with wave.open(sys.argv[2], 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((a * 32767).astype(np.int16).tobytes())
