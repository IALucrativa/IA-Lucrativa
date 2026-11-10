"""Gera a trilha de efeitos sonoros (audio.wav) sincronizada com scene.html.
Uso: python3 sfx.py audio.wav
"""
import sys, wave
import numpy as np

SR = 44100
DUR = 70.0
N = int(SR * DUR)
mix = np.zeros(N)
rng = np.random.default_rng(7)


def band(sig, lo, hi):
    f = np.fft.rfft(sig)
    fr = np.fft.rfftfreq(len(sig), 1 / SR)
    f[(fr < lo) | (fr > hi)] = 0
    return np.fft.irfft(f, len(sig))


def add(t0, sig, gain=1.0):
    i = int(t0 * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    mix[i:i + len(sig)] += sig * gain


def tt(d):
    return np.arange(int(d * SR)) / SR


def norm(x):
    m = np.max(np.abs(x))
    return x / m if m > 0 else x


# ambiente da sala (0 - 62.8)
amb = norm(band(rng.standard_normal(int(62.8 * SR)), 60, 500))
add(0, amb * np.minimum(1, tt(62.8) / 0.5), 0.035)

# relógio (tique-taque) até o estrondo
for k in range(0, 20):
    t = tt(0.05)
    add(k + 0.5, np.sin(2 * np.pi * (2600 if k % 2 else 2100) * t) * np.exp(-t * 160), 0.12)

# lápis riscando
for a, b in [(0.6, 6.0), (17.5, 20.0)]:
    d = b - a
    s = norm(band(rng.standard_normal(int(d * SR)), 2500, 7000))
    env = (0.5 + 0.5 * np.sin(2 * np.pi * 4.5 * tt(d))) ** 2
    add(a, s * env, 0.05)

# chicotes de câmera
for w in [6.0, 12.3, 16.9, 20.3, 25.1, 30.45, 44.8, 49.25]:
    d = 0.4
    s = norm(band(rng.standard_normal(int(d * SR)), 400, 5000))
    add(w, s * np.sin(np.pi * tt(d) / d) ** 2, 0.16)

# ESTRONDO (20.0)
t = tt(3.0)
boom = np.sin(2 * np.pi * (60 * np.exp(-t * 0.8) + 28) * t) * np.exp(-t * 1.4)
boom += norm(band(rng.standard_normal(len(t)), 20, 300)) * np.exp(-t * 2.2) * 0.9
boom += norm(band(rng.standard_normal(len(t)), 1500, 6000)) * np.exp(-t * 10) * 0.25  # vidros
add(20.0, norm(boom), 0.95)

# drone de tensão (21 - 62.8), crescendo
d = 62.8 - 21
t = tt(d)
dr = np.sin(2 * np.pi * 55 * t) + np.sin(2 * np.pi * 55.6 * t) + 0.5 * np.sin(2 * np.pi * 82.4 * t) + 0.25 * np.sin(2 * np.pi * 110.3 * t)
dr *= 0.6 + 0.4 * np.sin(2 * np.pi * 0.25 * t)
add(21, dr / 2.5 * (0.15 + 0.85 * (t / d) ** 1.5) * np.minimum(1, t / 2), 0.16)

# batimento cardíaco (49.4 - 62.8), acelerando
bt = 49.4
while bt < 62.6:
    bpm = 80 + (bt - 49.4) / 13 * 70
    for off, g in [(0, 1.0), (0.16, 0.7)]:
        x = tt(0.18)
        add(bt + off, np.sin(2 * np.pi * 52 * x) * np.exp(-x * 25), 0.5 * g)
    bt += 60 / bpm


# gemidos de zumbi
def groan(d, f0, seed):
    t = tt(d)
    r = np.random.default_rng(seed)
    f = f0 * (1 + 0.08 * np.sin(2 * np.pi * 5.5 * t) + 0.15 * np.sin(2 * np.pi * 0.7 * t + r.random()))
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = 2 * ((ph / (2 * np.pi)) % 1) - 1
    s = band(saw + 0.3 * r.standard_normal(len(t)), 80, 1100)
    return norm(s) * np.sin(np.pi * t / d) ** 0.7


for t0, d, f0, g in [(33.0, 2.2, 95, 0.18), (35.6, 2.6, 80, 0.2), (38.4, 1.8, 110, 0.32), (45.1, 2.0, 90, 0.35), (46.8, 2.4, 75, 0.35),
                     (55.8, 2.0, 85, 0.12), (58.2, 2.2, 95, 0.18), (60.4, 2.3, 80, 0.24)]:
    add(t0, groan(d, f0, int(t0 * 10)), g)

# alerta de emergência no celular (40.3 - 44.6): tom 853 + 960 Hz pulsado + vibração
d = 44.6 - 40.3
t = tt(d)
eas = (np.sin(2 * np.pi * 853 * t) + np.sin(2 * np.pi * 960 * t)) / 2
gate = ((t % 0.5) < 0.38).astype(float)
vib = band(rng.standard_normal(len(t)), 120, 220) * (((t + 0.25) % 1.0) < 0.5)
add(40.3, eas * gate * np.minimum(1, t / 0.05) * np.minimum(1, (d - t) / 0.1) * 0.22 + norm(vib) * 0.08)

# pancadas no vidro + trincas
for te in [45.0, 45.6, 46.4, 47.3]:
    x = tt(0.35)
    add(te, np.sin(2 * np.pi * 75 * x) * np.exp(-x * 14), 0.7)
    add(te, norm(band(rng.standard_normal(len(x)), 200, 2000)) * np.exp(-x * 30), 0.35)
    if te > 45.1:
        y = tt(0.6)
        add(te + 0.02, norm(band(rng.standard_normal(len(y)), 2500, 9000)) * np.exp(-y * 9) * (rng.random(len(y)) > 0.6), 0.45)

# batidas na porta
for te in [50.3, 50.6, 50.9, 54.0, 54.3, 54.6, 57.5, 57.8, 58.1, 59.6, 59.8, 60.0, 60.2, 60.4, 60.6, 60.8, 61.0, 61.2]:
    x = tt(0.25)
    add(te, np.sin(2 * np.pi * 110 * x) * np.exp(-x * 22), 0.75)
    add(te, norm(band(rng.standard_normal(len(x)), 300, 3000)) * np.exp(-x * 45), 0.3)

# impacto final (62.8) + silêncio + nota grave na tela de escolha
t = tt(3.5)
hit = np.sin(2 * np.pi * (40 + 30 * np.exp(-t * 3)) * t) * np.exp(-t * 1.2) + norm(band(rng.standard_normal(len(t)), 30, 900)) * np.exp(-t * 3) * 0.6
add(62.8, norm(hit), 0.9)
t = tt(6.4)
pad = (np.sin(2 * np.pi * 110 * t) + 0.6 * np.sin(2 * np.pi * 164.8 * t) + 0.4 * np.sin(2 * np.pi * 220.5 * t)) / 2
add(63.4, pad * np.minimum(1, t / 1.5) * np.minimum(1, (6.4 - t) / 1.5), 0.09)
x = tt(0.12)
for te in [63.6, 63.9]:
    add(te, np.sin(2 * np.pi * 880 * x) * np.exp(-x * 30), 0.15)

# master: limita picos e normaliza
mix = np.tanh(mix * 1.3) / np.tanh(1.3)
mix = mix / np.max(np.abs(mix)) * 0.92
pcm = (mix * 32767).astype(np.int16)
stereo = np.column_stack([pcm, pcm]).ravel()
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(stereo.tobytes())
print('ok')
