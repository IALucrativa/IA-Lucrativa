# "Prova" — vídeo POV de zumbis na escola (70 s, vertical 9:16)

| Tempo | Cena | Fala / efeito |
|---|---|---|
| 0–6 s | Olhando a prova, lápis na mão | **Você:** "Questão 7... eu não estudei nada disso." |
| 6–12 s | Vira para o Léo | **Você:** "Psiu... Léo! Qual é a da sete?" / **Léo:** "Fica quieto, mano! O professor tá olhando!" |
| 13–17 s | Professor aponta | **Professor:** "Vocês dois aí! Mais uma palavra e é ZERO!" |
| 20 s | De volta à prova — estrondo, luz pisca | **BUM!** |
| 22–25 s | Turma assustada | **Professor:** "Ninguém se mexe. Deve ser obra na rua." |
| 26–30 s | Bia de pé na janela | **Bia:** "Gente... tem alguém correndo lá no pátio." |
| 31–40 s | Vista do pátio: aluno fugindo, zumbis chegando, o porteiro zumbi encara a janela | **Você / Bia / Léo** |
| 40–45 s | Alerta no celular | "ALERTA EXTREMO — não abra portas para ninguém." |
| 45–49 s | Zumbis batem no vidro, que racha | **Professor:** "Todo mundo pro fundo da sala! AGORA!" |
| 50–62 s | Davi bate na porta; zumbis aparecem no corredor; sua mão vai até a maçaneta | **Davi:** "Abre a porta!" / **Léo:** "Não abre! Ele pode ter sido mordido!" |
| 63–70 s | Tela final | **O QUE VOCÊ FARIA?** [ABRIR A PORTA] [DEIXAR FECHADA] — Comenta aqui 👇 |

## Como gerar de novo
```bash
python3 sfx.py audio.wav                       # efeitos sonoros
node render.js video prova-zumbi.mp4 audio.wav # vídeo (precisa de Playwright + ffmpeg)
node render.js stills previas 2 10 20          # só alguns quadros para conferir
```
Falas, tempos e cores das legendas ficam em `SUBS` dentro de `scene.html`.
