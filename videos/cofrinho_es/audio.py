# Uso: python3 audio.py meta.json saida.wav  — sintetiza a trilha a partir da timeline
import json, sys, wave, numpy as np
meta = json.load(open(sys.argv[1])); FPS = 30; SR = 44100
N = int(meta['total'] / FPS * SR) + SR // 2
a = np.zeros(N); rng = np.random.default_rng(7)
def add(sig, t):
    i = int(t * SR); j = min(N, i + len(sig)); a[i:j] += sig[:j - i]
def env(n, atk=0.002, dec=0.1):
    t = np.arange(n) / SR; return np.minimum(t / atk, 1) * np.exp(-t / dec)
for r in meta['rounds']:
    t0, tc = r['start'] / FPS, r['contact'] / FPS; A = tc - t0
    # tensao: zumbido subindo de tom
    n = int(A * SR); t = np.arange(n) / SR; p = t / A
    f = 70 + 160 * p ** 1.5; ph = 2 * np.pi * np.cumsum(f) / SR
    hum = (np.sin(ph) + 0.4 * np.sin(2 * ph)) * (0.05 + 0.12 * p) * (0.8 + 0.2 * np.sin(2 * np.pi * 9 * t))
    add(hum, t0)
    # catraca do guincho: cliques cada vez mais rapidos
    tt = 0.0
    while tt < A - 0.03:
        k = 220
        add(rng.standard_normal(k) * env(k, 0.0005, 0.004) * 0.25, t0 + tt)
        tt += 0.13 - 0.09 * (tt / A)
    # ding no frame dourado
    n = int(0.5 * SR); t = np.arange(n) / SR
    add((np.sin(2 * np.pi * 1318 * t) + 0.5 * np.sin(2 * np.pi * 1976 * t)) * np.exp(-t / 0.12) * 0.22, tc)
    # impacto: boom + ceramica + moedas
    tb = tc + 1 / FPS
    n = int(0.6 * SR); t = np.arange(n) / SR
    add(np.sin(2 * np.pi * (90 * np.exp(-t * 6) + 35) * t) * np.exp(-t / 0.18) * 0.9, tb)
    noise = rng.standard_normal(n); hp = np.diff(noise, prepend=0)
    add(hp * np.exp(-t / 0.07) * 0.35, tb)
    for _ in range(18):
        m = int(0.12 * SR); tm = np.arange(m) / SR; fr = rng.uniform(2600, 5200)
        add((np.sin(2 * np.pi * fr * tm) + 0.6 * np.sin(2 * np.pi * fr * 1.48 * tm)) * np.exp(-tm / 0.03) * 0.08,
            tb + 0.05 + rng.uniform(0, 0.55))
# outro: whoosh
to = meta['outro'] / FPS; n = int(0.5 * SR); t = np.arange(n) / SR
w = np.convolve(rng.standard_normal(n), np.ones(30) / 30, 'same') * np.sin(np.pi * t / 0.5) * 0.6
add(w, to)
a = a / np.max(np.abs(a)) * 0.89
with wave.open(sys.argv[2], 'wb') as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((a * 32767).astype(np.int16).tobytes())
