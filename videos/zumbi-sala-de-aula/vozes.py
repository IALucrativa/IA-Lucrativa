"""Mistura as vozes (pasta vozes/) com a trilha de efeitos.
Uso: python3 vozes.py audio_sfx.wav saida.wav
Cada entrada: (arquivo, início no vídeo em s, corte em s ou None, efeito)
"""
import sys, subprocess, wave
import numpy as np

SR = 44100
VOZES = [
    ('01_voce_matheus.mp3', 0.4, None, None),
    ('02_voce_matheus.mp3', 4.6, None, None),
    ('03_leo_talis.mp3', 7.0, None, None),
    ('04_professor_yuri.mp3', 10.4, None, None),
    ('05_professor_yuri.mp3', 17.8, None, None),
    ('06_altofalante_juliana.mp3', 20.8, 3.85, 'radio'),
    ('07_voce_adam.mp3', 25.9, None, None),
    ('08_bia_daiane.mp3', 28.6, None, None),
    ('09_voce_adam.mp3', 33.8, None, None),
    ('10_bia_daiane.mp3', 36.7, None, None),
    ('11_leo_matheus.mp3', 40.2, None, None),
    ('12_voce_yuri.mp3', 43.2, None, None),
    ('13_professor_yuri.mp3', 48.1, None, None),
    ('14_professor_matheus.mp3', 52.0, None, None),
    ('15_leo_matheus.mp3', 54.8, None, None),
    ('16_professor_matheus.mp3', 57.0, None, None),
    ('17_davi_rakshit.mp3', 61.4, None, 'porta'),
    ('18_leo_matheus.mp3', 64.7, None, None),
    ('19_davi_rakshit.mp3', 68.0, None, 'porta'),
    ('20_davi_will.mp3', 70.0, None, 'porta'),
]
FILTROS = {
    None: 'anull',
    'radio': 'highpass=f=450,lowpass=f=3200,acrusher=bits=10:mode=log:aa=1,volume=1.4',
    'porta': 'lowpass=f=2200,aecho=0.6:0.4:18:0.25,volume=1.2',
}

def load(path, cut, fx):
    args = ['ffmpeg', '-v', 'error', '-i', path]
    if cut: args += ['-t', str(cut)]
    flt = FILTROS[fx] + (f',afade=t=out:st={cut - 0.08}:d=0.08' if cut else '')
    args += ['-af', flt, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-']
    return np.frombuffer(subprocess.run(args, capture_output=True, check=True).stdout, np.int16).astype(np.float32) / 32768

with wave.open(sys.argv[1]) as w:
    sfx = np.frombuffer(w.readframes(w.getnframes()), np.int16).reshape(-1, 2)[:, 0].astype(np.float32) / 32768
voice = np.zeros_like(sfx)
for f, t0, cut, fx in VOZES:
    a = load('vozes/' + f, cut, fx)
    i = int(t0 * SR); n = min(len(a), len(voice) - i)
    voice[i:i + n] += a[:n]
# abaixa os efeitos enquanto alguém fala (envelope suavizado)
env = np.abs(voice)
k = int(0.25 * SR); env = np.convolve(env, np.ones(k) / k, mode='same')
duck = 1 - 0.55 * np.clip(env / 0.03, 0, 1)
mix = sfx * duck + voice * 1.1
mix = np.tanh(mix * 1.2) / np.tanh(1.2)
mix = mix / np.max(np.abs(mix)) * 0.95
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(np.column_stack([pcm, pcm]).ravel().tobytes())
print('ok')
