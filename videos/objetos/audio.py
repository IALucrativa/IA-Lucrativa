# Uso: python3 audio.py meta.json saida.wav  -- trilha de marimba original + efeitos
import json, sys, wave, numpy as np
meta = json.load(open(sys.argv[1])); FPS = 30; SR = 44100
END = meta['total'] / FPS; N = int(END * SR) + SR // 2
sfx = np.zeros(N); mus = np.zeros(N); rng = np.random.default_rng(4)
def put(buf, sig, t):
    i = max(0, int(t * SR)); j = min(N, i + len(sig)); buf[i:j] += sig[:j - i]
def marimba(f, d=0.35, v=0.2):
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.02)) * np.exp(-t / 0.12) * v
def tick(f=2200, v=0.12): n = int(0.03 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t / 0.006) * v
mid = lambda m: 440 * 2 ** ((m - 69) / 12)
H0, ENDF = meta['hook'] / FPS, meta['end'] / FPS
# gancho: "ta-da" de marimba + whoosh
for k, m in enumerate([72, 76, 79, 84]): put(sfx, marimba(mid(m), 0.5, 0.22), 0.02 + k * 0.06)
# musica: 128 bpm, colcheias; progressao F - C - Dm - Bb (original)
chords = [(65, 69, 72), (60, 64, 67), (62, 65, 69), (58, 62, 65)]; bassn = [41, 36, 38, 34]
step = 60 / 128 / 2; t = H0; s = 0
mel = [0, 2, 1, 2, 0, 1, 2, 1]
while t < END:
    c = (s // 8) % 4; ch = chords[c]
    if s % 2 == 0: put(mus, marimba(mid(bassn[c] + 12), 0.4, 0.16), t)
    put(mus, marimba(mid(ch[mel[s % 8]] + 12), 0.25, 0.08), t)
    t += step; s += 1
# niveis: boing, tique-taque e ding no frame da resposta
for lv in meta['levels']:
    st, rv = lv['start'] / FPS, lv['reveal'] / FPS
    n = int(0.3 * SR); tt = np.arange(n) / SR
    put(sfx, np.sin(2 * np.pi * np.cumsum(180 + 500 * tt) / SR) * np.exp(-tt / 0.12) * 0.3, st)
    tk = st + 0.3; k = 0
    while tk < rv:
        last = rv - tk < 1.0
        put(sfx, tick(2200 if k % 2 == 0 else 1700, 0.14 if last else 0.1), tk)
        tk += 0.25 if last else 0.5; k += 1
    put(sfx, marimba(mid(88), 0.5, 0.25) + marimba(mid(84), 0.5, 0.15), rv)
# final: vinheta
for k, m in enumerate([72, 74, 76, 79, 84]): put(sfx, marimba(mid(m), 0.5, 0.2), ENDF + k * 0.09)
# tiques leves a cada troca de objeto (sem som especial no lendario, pra nao entregar)
for f in meta['changes']:
    n = int(0.02 * SR); tt = np.arange(n) / SR
    put(sfx, np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt / 0.004) * 0.07, f / FPS)
a = mus * 0.9 + sfx
a = a / np.max(np.abs(a)) * 0.89
with wave.open(sys.argv[2], 'wb') as fw:
    fw.setnchannels(1); fw.setsampwidth(2); fw.setframerate(SR); fw.writeframes((a * 32767).astype(np.int16).tobytes())
