# ZUMBIS NA ESCOLA — Parte 02 "A Mensagem" (84 s, vertical 9:16)

Continuação da Parte 01. O público escolheu **DEIXAR FECHADA**.

| Tempo | Cena |
|---|---|
| 0–14,5 s | Porta no escuro. Davi implora, os zumbis chegam e o puxam; a mão dele escorrega no vidro deixando marcas. |
| 14,5–29 s | Sala no escuro, todos no chão. Léo com culpa, Bia chorando, professor na janela: ninguém sai até o resgate. |
| 29–31,6 s | Cartela **2 HORAS DEPOIS...** |
| 31,6–43,5 s | Entardecer vermelho. Mensagem do Davi no celular: "por que vocês não abriram?". Arranhões na porta. |
| 43,5–59,5 s | Davi zumbi no vidro batendo com o dedo. Nova mensagem: "eu tô vendo vocês". Quem está mandando? Pancadas. |
| 59,5–70 s | Janela: o telhado da cantina logo abaixo, zumbis no pátio olhando pra cima. |
| 70–75,6 s | O vidro da porta quebra, braços atravessam, a barricada escorrega. "Ou pula... ou fica!" |
| 75,6–84 s | **O QUE VOCÊ FARIA?** [PULAR A JANELA] [FICAR E LUTAR] |

## Como gerar
```bash
python3 sfx.py audio.wav
python3 vozes.py audio.wav mix.wav     # usa os áudios que estiverem em vozes/
node render.js video ep02-a-mensagem.mp4 mix.wav
node render.js cover capa_720.png && ffmpeg -i capa_720.png -vf scale=1080:1920:flags=lanczos capa.png
```
