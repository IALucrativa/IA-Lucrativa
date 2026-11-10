# "Prova" — vídeo POV de zumbis na escola (80 s, vertical 9:16)

| Tempo | Cena | Fala / efeito |
|---|---|---|
| 0–3,5 s | Olhando a prova, lápis na mão | **Você:** "Questão 7... eu não estudei nada disso." |
| 4–10 s | Vira para o Léo | **Você:** "Psiu... Léo! Qual é a da sete?" / **Léo:** "Fica quieto, mano! O professor tá olhando!" |
| 10–14 s | Professor aponta | **Professor:** "Vocês dois aí! Mais uma palavra e é ZERO!" |
| 14–16,5 s | Professor volta a escrever na lousa | (tique-taque do relógio) |
| 16,5 s | Estrondo, luz pisca, turma assustada | **BUM!** / **Professor:** "Ninguém se mexe. Deve ser obra na rua." |
| 21,6–27,5 s | **NOVA:** alto-falante da escola | **Alto-falante:** "Atenção, alunos! Permaneçam nas salas. Repito, perman—" **AAAAH!** / **Você:** "Isso foi... um grito?" |
| 28–33 s | Bia de pé na janela | **Bia:** "Gente... tem alguém correndo lá no pátio." |
| 33–42,5 s | Pátio: aluno fugindo, zumbis, o porteiro zumbi encara a janela | **Você / Bia / Léo** |
| 42,5–47,3 s | Alerta no celular | "ALERTA EXTREMO — não abra portas para ninguém." |
| 47,4–51,8 s | Zumbis batem no vidro, que racha | **Professor:** "Todo mundo pro fundo da sala! AGORA!" |
| 51,8–59,8 s | **NOVA:** barricada — professor tranca a porta, carteiras empurradas, luz apagada | **Professor:** "Tranca a porta! Encosta as carteiras!" / **Léo:** "Apaga a luz!" / **Professor:** "Shhh... ninguém faz um barulho." |
| 60–73 s | No escuro: Davi bate na porta, zumbis no corredor, sua mão vai até a maçaneta | **Davi:** "Abre a porta!" / **Léo:** "Não abre! Ele pode ter sido mordido!" |
| 73–80,5 s | Tela final | **O QUE VOCÊ FARIA?** [ABRIR A PORTA] [DEIXAR FECHADA] — Comenta aqui 👇 |

## Como gerar de novo
```bash
python3 sfx.py audio.wav                       # efeitos sonoros
node render.js video prova-zumbi.mp4 audio.wav # vídeo (precisa de Playwright + ffmpeg)
node render.js stills previas 2 10 20          # só alguns quadros para conferir
```
Falas, tempos e cores das legendas ficam em `SUBS` dentro de `scene.html`.
