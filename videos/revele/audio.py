# Uso: python3 audio.py meta.json saida.wav  -- trilha mistica original + efeitos
import json, sys, wave, numpy as np
meta = json.load(open(sys.argv[1])); FPS = 30; SR = 44100
END = meta['total'] / FPS; N = int(END * SR) + SR // 2
sfx = np.zeros(N); mus = np.zeros(N); rng = np.random.default_rng(31)
def put(buf, sig, t):
    i = max(0, int(t * SR)); j = min(N, i + len(sig)); buf[i:j] += sig[:j - i]
def bell(f, d, v):
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sin(2*np.pi*f*t) + 0.4*np.sin(2*np.pi*f*2.76*t)*np.exp(-t/0.08) + 0.2*np.sin(2*np.pi*f*5.4*t)*np.exp(-t/0.03)) * np.exp(-t/0.5) * v
def pad(f, d, v):
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sin(2*np.pi*f*t) + 0.5*np.sin(2*np.pi*f*1.003*t)) * np.minimum(1, t/0.4) * np.minimum(1, (d-t)/0.4) * v
mid = lambda m: 440 * 2 ** ((m - 69) / 12)
H0, ENDF, LEG = meta['hook'] / FPS, meta['end'] / FPS, meta['legend'] / FPS
# gancho: brilho magico (glissando de sininhos)
for k in range(10): put(sfx, bell(mid(72 + k*2), 0.5, 0.07), k * 0.04)
# musica: 96 bpm, Am - F - C - E (caixinha de musica + pad)
chords = [(57, 60, 64), (53, 57, 60), (48, 52, 55), (52, 56, 59)]
beat = 60 / 96; step = beat / 2; t = 0.0; s = 0
arp = [0, 1, 2, 1, 2, 0, 1, 2]
while t < END:
    c = (s // 8) % 4; ch = chords[c]
    if s % 8 == 0:
        for m in ch: put(mus, pad(mid(m), beat * 4, 0.035), t)
        put(mus, pad(mid(ch[0] - 12), beat * 4, 0.06), t)
    put(mus, bell(mid(ch[arp[s % 8]] + 24), 0.6, 0.05), t)
    t += step; s += 1
# tiques a cada troca de resultado (leves)
for f in meta['changes']:
    n = int(0.02 * SR); tt = np.arange(n) / SR
    put(sfx, np.sin(2*np.pi*2600*tt) * np.exp(-tt/0.004) * 0.06, f / FPS)
# lendario: acorde dourado
for k, m in enumerate([81, 84, 88, 93]): put(sfx, bell(mid(m), 0.8, 0.1), LEG + k * 0.03)
# final: vinheta
for k, m in enumerate([69, 72, 76, 81, 84]): put(sfx, bell(mid(m), 0.8, 0.09), ENDF + k * 0.09)
a = mus * 0.9 + sfx
a = a / np.max(np.abs(a)) * 0.89
with wave.open(sys.argv[2], 'wb') as fw:
    fw.setnchannels(1); fw.setsampwidth(2); fw.setframerate(SR); fw.writeframes((a * 32767).astype(np.int16).tobytes())
