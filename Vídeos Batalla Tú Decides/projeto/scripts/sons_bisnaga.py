"""Cria os efeitos sonoros do Bisnaga (tudo sintetizado aqui, sem gravação de ninguém)."""
import numpy as np, wave, pathlib
SR = 44100
OUT = pathlib.Path(__file__).resolve().parents[1] / 'public/sfx'
rng = np.random.default_rng(3)

def salva(nome, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    with wave.open(str(OUT / nome), 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def t(d): return np.arange(int(SR * d)) / SR

# tlec: louça batendo (parciais agudos que somem rápido)
def tlec():
    x = t(0.18); s = 0
    for f, a in [(2650, 1), (4120, .6), (6900, .35), (1730, .4)]:
        s = s + a * np.sin(2 * np.pi * f * x) * np.exp(-x * 38)
    return s
salva('tlec.wav', tlec())

# vários tlecs: pinguins pulando
x = np.zeros(int(SR * 2.2))
for k in range(26):
    i = int(SR * (0.05 + rng.random() * 2.0)); s = tlec() * (0.4 + rng.random() * 0.6)
    s = np.interp(np.arange(len(s)) * (0.8 + rng.random() * 0.5), np.arange(len(s)), s)
    x[i:i + len(s)] += s[: len(x) - i]
salva('tlec_varios.wav', x)

# ronco: ruído grave filtrado, entra e sai
x = t(3.2); n = rng.standard_normal(len(x))
k = np.ones(60) / 60; n = np.convolve(n, k, 'same')
env = np.clip(np.sin(np.pi * x / 1.6), 0, None) ** 2
salva('ronco.wav', n * env * (1 + 0.5 * np.sin(2 * np.pi * 28 * x)))

# baque: gato caindo no balcão
x = t(0.35)
salva('baque.wav', np.sin(2 * np.pi * (90 - 60 * x) * x) * np.exp(-x * 18) + 0.15 * rng.standard_normal(len(x)) * np.exp(-x * 60))

# pop: gato aparecendo/sumindo
x = t(0.12)
salva('pop.wav', np.sin(2 * np.pi * (500 + 2500 * x) * x) * np.exp(-x * 40))

# escorregar: chiado que passa
x = t(0.9); n = rng.standard_normal(len(x)); n = n - np.convolve(n, np.ones(6) / 6, 'same')
salva('escorregar.wav', n * np.sin(np.pi * x / 0.9) ** 2)

# caixinha de música: início de "Pour Elise" (Beethoven, domínio público), sintetizado aqui
notas = [('E5', .25), ('D#5', .25), ('E5', .25), ('D#5', .25), ('E5', .25), ('B4', .25), ('D5', .25), ('C5', .25), ('A4', .6),
         ('C4', .25), ('E4', .25), ('A4', .25), ('B4', .6), ('E4', .25), ('G#4', .25), ('B4', .25), ('C5', .8)]
base = {'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2}
def freq(n): return 440 * 2 ** ((base[n[:-1]] + 12 * (int(n[-1]) - 4)) / 12)
tot = sum(d for _, d in notas) + 1.5
x = np.zeros(int(SR * tot)); pos = 0.0
for n, d in notas:
    f = freq(n); y = t(1.4)
    s = (np.sin(2 * np.pi * f * y) + .4 * np.sin(2 * np.pi * 2 * f * y) + .15 * np.sin(2 * np.pi * 4.2 * f * y)) * np.exp(-y * 3.5)
    i = int(SR * pos); x[i:i + len(s)] += s[: len(x) - i]; pos += d * 0.9
salva('caixinha.wav', x)
print('ok')

# ---------- Batalha do Desafio 1 ----------
def miado(f0, d, sobe=1.25, voz=0.0):
    x = t(d); k = x / d
    f = f0 * (1 + (sobe - 1) * np.sin(np.pi * np.clip(k * 1.1, 0, 1)))
    fase = 2 * np.pi * np.cumsum(f) / SR
    s = sum(a * np.sin(h * fase) for h, a in [(1, 1), (2, .55), (3, .35), (4, .2), (5, .1)])
    s = s + voz * rng.standard_normal(len(x)) * 0.3
    return s * np.sin(np.pi * k) ** 0.6

# grito do feirante: miado longo e rasgado, com tremido
x = t(1.8); g = miado(420, 1.8, 1.5, 0.6) * (1 + 0.35 * np.sin(2 * np.pi * 9 * x))
salva('grito.wav', g)
# miadinho rouco
salva('miadinho.wav', miado(700, 0.45, 1.15, 1.2) * 0.6)
# nham: mastigar (estalinhos abafados)
x = np.zeros(int(SR * 1.6))
for k in range(7):
    i = int(SR * (0.05 + k * 0.21 + rng.random() * 0.04)); y = t(0.09)
    s = rng.standard_normal(len(y)) * np.exp(-y * 55); s = np.convolve(s, np.ones(14) / 14, 'same')
    x[i:i + len(s)] += s
salva('nham.wav', x)
# clang: formas de metal caindo
x = np.zeros(int(SR * 1.8))
for k in range(9):
    i = int(SR * (k * 0.11 + rng.random() * 0.05)); y = t(0.7)
    f = 900 + rng.random() * 1400
    s = sum(a * np.sin(2 * np.pi * f * m * y) for m, a in [(1, 1), (2.76, .5), (5.4, .25)]) * np.exp(-y * (6 + rng.random() * 6))
    x[i:i + len(s)] += s[: len(x) - i] * (1 - k * 0.07)
salva('clang.wav', x)
# roer: raspadinhas rápidas de dente em metal
x = np.zeros(int(SR * 3.0))
for k in range(34):
    i = int(SR * (k * 0.085 + rng.random() * 0.02)); y = t(0.05)
    s = rng.standard_normal(len(y)); s = s - np.convolve(s, np.ones(4) / 4, 'same')
    s = s * np.exp(-y * 70) * (0.5 + 0.5 * np.sin(k * 0.7) ** 2)
    x[i:i + len(s)] += s[: len(x) - i]
salva('roer.wav', x)
# ta-dá grave do placar final (dois acordes de metais sintetizados)
def acorde(fs, d):
    y = t(d); return sum(np.sign(np.sin(2 * np.pi * f * y)) * 0.3 + np.sin(2 * np.pi * f * y) for f in fs) * np.exp(-y * 1.8)
a = acorde([196, 247, 294], 0.35); b = acorde([174.6, 220, 262], 1.4)
salva('placar.wav', np.concatenate([a, b]))
print('batalha ok')

