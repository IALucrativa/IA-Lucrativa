"""Efeitos sonoros do EP. 02 "A Mensagem" (sincronizados com scene.html).
Uso: python3 sfx.py audio.wav
"""
import sys, wave
import numpy as np

SR = 44100
DUR = 84.0
N = int(SR * DUR)
mix = np.zeros(N)
rng = np.random.default_rng(11)


def band(sig, lo, hi):
    f = np.fft.rfft(sig); fr = np.fft.rfftfreq(len(sig), 1 / SR)
    f[(fr < lo) | (fr > hi)] = 0
    return np.fft.irfft(f, len(sig))


def add(t0, sig, gain=1.0):
    i = int(t0 * SR)
    if i >= N: return
    sig = sig[: N - i]; mix[i:i + len(sig)] += sig * gain


def tt(d): return np.arange(int(d * SR)) / SR
def norm(x): m = np.max(np.abs(x)); return x / m if m > 0 else x


def groan(d, f0, seed):
    t = tt(d); r = np.random.default_rng(seed)
    f = f0 * (1 + 0.08 * np.sin(2 * np.pi * 5.5 * t) + 0.15 * np.sin(2 * np.pi * 0.7 * t + r.random()))
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = band(2 * ((ph / (2 * np.pi)) % 1) - 1 + 0.3 * r.standard_normal(len(t)), 80, 1100)
    return norm(s) * np.sin(np.pi * t / d) ** 0.7


def knock(te, g=0.7, muffle=False):
    x = tt(0.25)
    add(te, np.sin(2 * np.pi * (90 if muffle else 110) * x) * np.exp(-x * 22), g)
    add(te, norm(band(rng.standard_normal(len(x)), 200, 1200 if muffle else 3000)) * np.exp(-x * 45), g * 0.4)


def buzz(te):
    for k in range(2):
        x = tt(0.3)
        add(te + k * 0.4, norm(band(rng.standard_normal(len(x)), 120, 240)) * np.sin(np.pi * x / 0.3), 0.25)


# ambiente escuro (sala sem luz) + drone grave o vídeo todo
amb = norm(band(rng.standard_normal(N), 50, 400)); add(0, amb, 0.03)
t = tt(DUR)
dr = (np.sin(2 * np.pi * 55 * t) + np.sin(2 * np.pi * 55.5 * t) + 0.5 * np.sin(2 * np.pi * 82.4 * t)) / 2.5
lvl = np.interp(t, [0, 8, 12, 29, 31.6, 42, 57, 70, 75.6, 76, 84], [0.4, 0.8, 0.3, 0.35, 0.2, 0.5, 0.8, 0.9, 1.0, 0, 0])
add(0, dr * lvl * (0.6 + 0.4 * np.sin(2 * np.pi * 0.2 * t)), 0.13)

# batidas fracas do Davi
for te in [0.25, 1.1, 2.7]: knock(te, 0.45, True)
# zumbis chegando + grito + Davi arrastado
for t0, d, f0, g in [(5.6, 2.2, 90, 0.2), (7.2, 2.0, 75, 0.3), (9.4, 2.4, 85, 0.25)]: add(t0, groan(d, f0, int(t0 * 10)), g)
x = tt(0.9); f = 650 + 350 * np.sin(np.pi * x / 0.9) + 30 * np.sin(2 * np.pi * 9 * x); ph = 2 * np.pi * np.cumsum(f) / SR
add(8.8, norm(band((2 * ((ph / (2 * np.pi)) % 1) - 1) + 0.4 * rng.standard_normal(len(x)), 500, 3000)) * np.sin(np.pi * x / 0.9) ** 0.4, 0.3)
# mão escorregando no vidro (rangido)
x = tt(2.2); f = 1800 + 500 * np.sin(2 * np.pi * 1.3 * x) + 200 * rng.standard_normal(len(x)).cumsum() / 400
add(9.4, np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.5 + 0.5 * (np.sin(2 * np.pi * 23 * x) > 0)) * np.sin(np.pi * x / 2.2), 0.1)

# coração no silêncio pós-Davi
bt = 11.6
while bt < 14.4:
    for off, g in [(0, 1.0), (0.17, 0.7)]:
        x = tt(0.18); add(bt + off, np.sin(2 * np.pi * 52 * x) * np.exp(-x * 25), 0.5 * g)
    bt += 0.85

# relógio na cartela "2 horas depois"
for k in range(5):
    x = tt(0.05); add(29.2 + k * 0.5, np.sin(2 * np.pi * (2600 if k % 2 else 2100) * x) * np.exp(-x * 160), 0.16)
# entardecer: vento leve
x = tt(12); add(31.6, norm(band(rng.standard_normal(len(x)), 200, 900)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * x)) * np.minimum(1, x / 1.5), 0.05)

# celular
buzz(32.4); buzz(49.0)
for te in [33.0, 33.9, 50.6]:
    x = tt(0.15); add(te, np.sin(2 * np.pi * 1320 * x) * np.exp(-x * 30) + 0.5 * np.sin(2 * np.pi * 1760 * x) * np.exp(-x * 40), 0.12)

# arranhões na porta
x = tt(1.8); scr = norm(band(rng.standard_normal(len(x)), 1500, 6000)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 6 * x)))
add(42.0, scr * np.sin(np.pi * x / 1.8), 0.22)
# dedo no vidro
for te in [46.0, 47.0, 48.0]:
    x = tt(0.08); add(te, norm(band(rng.standard_normal(len(x)), 2000, 7000)) * np.exp(-x * 80), 0.35)
for t0, d, f0, g in [(44.4, 2.0, 70, 0.12), (54.0, 2.2, 85, 0.22), (55.8, 2.0, 95, 0.25), (66.0, 2.4, 80, 0.15), (71.0, 2.4, 75, 0.35), (73.0, 2.2, 90, 0.35)]:
    add(t0, groan(d, f0, int(t0 * 10)), g)

# pancadas na porta + vidro trincando + estilhaçando
for te in [57.4, 58.0, 58.6, 60.8, 62.3, 63.9, 65.6, 67.4, 69.1, 70.5, 71.3, 72.1, 72.9, 73.7, 74.5]:
    far = 59.5 < te < 70
    knock(te, 0.45 if far else 0.85, far)
    if te < 59:
        y = tt(0.5); add(te + 0.02, norm(band(rng.standard_normal(len(y)), 2500, 9000)) * np.exp(-y * 10) * (rng.random(len(y)) > 0.6), 0.35)
x = tt(1.6)
add(70.5, norm(band(rng.standard_normal(len(x)), 1500, 10000)) * np.exp(-x * 3) * (rng.random(len(x)) > 0.4), 0.6)
add(70.5, np.sin(2 * np.pi * 60 * x) * np.exp(-x * 4), 0.6)
# carteiras arrastando no fim
x = tt(4.5); add(70.6, norm(band(rng.standard_normal(len(x)), 250, 1500)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 9 * x))) * np.sin(np.pi * x / 4.5) ** 0.5, 0.15)

# impacto final + nota da tela de escolha
x = tt(3.5)
add(75.6, norm(np.sin(2 * np.pi * (40 + 30 * np.exp(-x * 3)) * x) * np.exp(-x * 1.2) + norm(band(rng.standard_normal(len(x)), 30, 900)) * np.exp(-x * 3) * 0.6), 0.9)
x = tt(7.8)
add(76.2, (np.sin(2 * np.pi * 110 * x) + 0.6 * np.sin(2 * np.pi * 164.8 * x) + 0.4 * np.sin(2 * np.pi * 220.5 * x)) / 2 * np.minimum(1, x / 1.5) * np.minimum(1, (7.8 - x) / 1.5), 0.09)
x = tt(0.12)
for te in [76.3, 76.6]: add(te, np.sin(2 * np.pi * 880 * x) * np.exp(-x * 30), 0.15)

mix = np.tanh(mix * 1.3) / np.tanh(1.3)
mix = mix / np.max(np.abs(mix)) * 0.92
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'audio.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(np.column_stack([pcm, pcm]).ravel().tobytes())
print('ok')
