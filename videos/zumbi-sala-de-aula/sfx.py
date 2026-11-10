"""Gera a trilha de efeitos sonoros (audio.wav) sincronizada com scene.html.
Uso: python3 sfx.py audio.wav
"""
import sys, wave
import numpy as np

SR = 44100
DUR = 80.5
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
amb = norm(band(rng.standard_normal(int(56.6 * SR)), 60, 500))
add(0, amb * np.minimum(1, tt(56.6) / 0.5), 0.035)

# relógio (tique-taque) até o estrondo
for k in range(0, 16):
    t = tt(0.05)
    add(k + 0.5, np.sin(2 * np.pi * (2600 if k % 2 else 2100) * t) * np.exp(-t * 160), 0.12)

# lápis riscando
for a, b in [(0.4, 3.6)]:
    d = b - a
    s = norm(band(rng.standard_normal(int(d * SR)), 2500, 7000))
    env = (0.5 + 0.5 * np.sin(2 * np.pi * 4.5 * tt(d))) ** 2
    add(a, s * env, 0.05)

# chicotes de câmera
for w in [3.6, 9.6, 14.0, 21.9, 26.4, 27.3, 32.8, 47.15, 51.6, 59.6]:
    d = 0.4
    s = norm(band(rng.standard_normal(int(d * SR)), 400, 5000))
    add(w, s * np.sin(np.pi * tt(d) / d) ** 2, 0.16)

# ESTRONDO (20.0)
t = tt(3.0)
boom = np.sin(2 * np.pi * (60 * np.exp(-t * 0.8) + 28) * t) * np.exp(-t * 1.4)
boom += norm(band(rng.standard_normal(len(t)), 20, 300)) * np.exp(-t * 2.2) * 0.9
boom += norm(band(rng.standard_normal(len(t)), 1500, 6000)) * np.exp(-t * 10) * 0.25  # vidros
add(16.5, norm(boom), 0.95)

# drone de tensão (21 - 62.8), crescendo
d = 73.2 - 17.5
t = tt(d)
dr = np.sin(2 * np.pi * 55 * t) + np.sin(2 * np.pi * 55.6 * t) + 0.5 * np.sin(2 * np.pi * 82.4 * t) + 0.25 * np.sin(2 * np.pi * 110.3 * t)
dr *= 0.6 + 0.4 * np.sin(2 * np.pi * 0.25 * t)
add(17.5, dr / 2.5 * (0.15 + 0.85 * (t / d) ** 1.5) * np.minimum(1, t / 2), 0.16)

# batimento cardíaco (49.4 - 62.8), acelerando
bt = 57.2
while bt < 73.0:
    bpm = 75 + (bt - 57.2) / 16 * 80
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


for t0, d, f0, g in [(35.4, 2.2, 95, 0.18), (38.0, 2.6, 80, 0.2), (40.8, 1.8, 110, 0.32), (47.5, 2.0, 90, 0.35), (49.2, 2.4, 75, 0.35),
                     (57.6, 2.2, 70, 0.08), (59.0, 2.0, 85, 0.1), (66.2, 2.0, 85, 0.12), (68.6, 2.2, 95, 0.18), (70.8, 2.3, 80, 0.24)]:
    add(t0, groan(d, f0, int(t0 * 10)), g)

# alerta de emergência no celular (40.3 - 44.6): tom 853 + 960 Hz pulsado + vibração
d = 47.0 - 42.7
t = tt(d)
eas = (np.sin(2 * np.pi * 853 * t) + np.sin(2 * np.pi * 960 * t)) / 2
gate = ((t % 0.5) < 0.38).astype(float)
vib = band(rng.standard_normal(len(t)), 120, 220) * (((t + 0.25) % 1.0) < 0.5)
add(42.7, eas * gate * np.minimum(1, t / 0.05) * np.minimum(1, (d - t) / 0.1) * 0.22 + norm(vib) * 0.08)

# pancadas no vidro + trincas
for te in [47.4, 48.0, 48.8, 49.7]:
    x = tt(0.35)
    add(te, np.sin(2 * np.pi * 75 * x) * np.exp(-x * 14), 0.7)
    add(te, norm(band(rng.standard_normal(len(x)), 200, 2000)) * np.exp(-x * 30), 0.35)
    if te > 47.5:
        y = tt(0.6)
        add(te + 0.02, norm(band(rng.standard_normal(len(y)), 2500, 9000)) * np.exp(-y * 9) * (rng.random(len(y)) > 0.6), 0.45)

# batidas na porta
for te in [x + 10.4 for x in [50.3, 50.6, 50.9, 54.0, 54.3, 54.6, 57.5, 57.8, 58.1, 59.6, 59.8, 60.0, 60.2, 60.4, 60.6, 60.8, 61.0, 61.2]]:
    x = tt(0.25)
    add(te, np.sin(2 * np.pi * 110 * x) * np.exp(-x * 22), 0.75)
    add(te, norm(band(rng.standard_normal(len(x)), 300, 3000)) * np.exp(-x * 45), 0.3)

# impacto final (62.8) + silêncio + nota grave na tela de escolha
t = tt(3.5)
hit = np.sin(2 * np.pi * (40 + 30 * np.exp(-t * 3)) * t) * np.exp(-t * 1.2) + norm(band(rng.standard_normal(len(t)), 30, 900)) * np.exp(-t * 3) * 0.6
add(73.2, norm(hit), 0.9)
t = tt(6.6)
pad = (np.sin(2 * np.pi * 110 * t) + 0.6 * np.sin(2 * np.pi * 164.8 * t) + 0.4 * np.sin(2 * np.pi * 220.5 * t)) / 2
add(73.8, pad * np.minimum(1, t / 1.5) * np.minimum(1, (6.6 - t) / 1.5), 0.09)
x = tt(0.12)
for te in [74.0, 74.3]:
    add(te, np.sin(2 * np.pi * 880 * x) * np.exp(-x * 30), 0.15)

# alto-falante: sinal "dim-dom", chiado, grito cortado
for te, f in [(20.25, 660), (20.55, 523)]:
    x = tt(0.6)
    add(te, (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * 2 * f * x)) * np.exp(-x * 5), 0.18)
x = tt(3.8)
add(20.8, norm(band(rng.standard_normal(len(x)), 1500, 4000)) * 0.5 * (0.6 + 0.4 * np.sin(2 * np.pi * 7 * x)), 0.03)
x = tt(0.75)
f = 700 + 300 * np.sin(np.pi * x / 0.75) + 25 * np.sin(2 * np.pi * 9 * x)
ph = 2 * np.pi * np.cumsum(f) / SR
scream = band((2 * ((ph / (2 * np.pi)) % 1) - 1) + 0.4 * rng.standard_normal(len(x)), 500, 3500)
add(24.55, norm(scream) * np.sin(np.pi * x / 0.75) ** 0.4, 0.3)
x = tt(1.1)
add(25.2, norm(band(rng.standard_normal(len(x)), 800, 8000)) * np.exp(-x * 2.5) * (rng.random(len(x)) > 0.3), 0.3)

# barricada: carteiras arrastando, chaves, interruptor
for a0, b0 in [(52.0, 53.8), (53.4, 55.4)]:
    d = b0 - a0
    x = tt(d)
    scr = norm(band(rng.standard_normal(len(x)), 250, 1800)) * (0.55 + 0.45 * np.sign(np.sin(2 * np.pi * 11 * x)))
    add(a0, scr * np.sin(np.pi * x / d) ** 0.5, 0.22)
for k in range(10):
    x = tt(0.08)
    add(52.2 + k * 0.28 + rng.random() * 0.1, np.sin(2 * np.pi * (3000 + rng.random() * 2500) * x) * np.exp(-x * 60), 0.08)
x = tt(0.05)
add(56.6, norm(band(rng.standard_normal(len(x)), 1000, 6000)) * np.exp(-x * 120), 0.5)

# master: limita picos e normaliza
mix = np.tanh(mix * 1.3) / np.tanh(1.3)
mix = mix / np.max(np.abs(mix)) * 0.92
pcm = (mix * 32767).astype(np.int16)
stereo = np.column_stack([pcm, pcm]).ravel()
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(stereo.tobytes())
print('ok')
