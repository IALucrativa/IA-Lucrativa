# Regra: vídeos curtos no estilo "Claude Code + 3D"

Regra baseada na análise de um Reels de referência (9:16, 720×1280, 30 fps, 26,7 s, narração contínua com trilha).
Todo vídeo novo nesse estilo deve seguir as seções abaixo. Use os itens marcados **OBRIGATÓRIO** como checklist antes de publicar.

---

## 1. Formato técnico — OBRIGATÓRIO

| Item | Valor |
|---|---|
| Proporção | 9:16 vertical (1080×1920 ideal; mínimo 720×1280) |
| FPS | 30 |
| Duração | 20–30 s (alvo: ~27 s) |
| Áudio | Narração contínua do início ao fim, sem silêncios > 0,3 s, com trilha baixa por baixo |
| Cortes | Troca de cena a cada 1,5–4 s (a referência tem 9 cenas em 27 s) |
| Área segura | Nada importante nos 12% de cima nem nos 20% de baixo (UI do Instagram/TikTok) |

---

## 2. Identidade visual — OBRIGATÓRIO

### Paleta
| Papel | Cor |
|---|---|
| Destaque principal (palavras-chave, números, botões) | Laranja `#F07A2E` → `#FF8A3D` |
| Texto principal | Branco `#FFFFFF` |
| Texto "ainda não falado" na legenda | Cinza `#8A8A8A` |
| Fundo frio (cenas de prova/estúdio) | Azul escuro `#0A1530` com luz azul ciano à esquerda e laranja à direita |
| Fundo quente (cenas de oferta/CTA) | Gradiente laranja `#E2572A` → `#F59A3C` com feixes de luz vindos do topo |
| Fundo escuro (gancho/interface) | Preto `#050505` com estrelas ou brilho laranja difuso e bokeh |
| Pílulas/cartões | Preto `#141414` a `#1E1E1E`, cantos 14–20 px, sombra suave |

### Tipografia
- **Títulos:** sans-serif pesada e condensada no espaçamento (Inter Black / SF Pro Display Heavy / Archivo Black), tracking negativo.
  - Padrão de 2 linhas: **linha 1 em laranja** (o gancho/verbo/número) + **linha 2 em branco** (complemento).
  - Ex.: "**Pesquisou,**" (laranja) / "escreveu, narrou" (branco).
- **Números de prova:** enormes, laranja, com "+" na frente ("+20 milhões", "+100 mil"), subtítulo pequeno branco embaixo.
- **Palavra-ênfase da legenda:** serifa itálica (Playfair Display Italic / Instrument Serif Italic) dentro de uma **caixa de seleção laranja com alças nos cantos** — imitando um editor de design. Use 1 vez a cada 2–3 cenas, só em verbos-chave ("Sol", "aprova").

### Elementos fixos em todas as cenas
- **@handle do perfil** centralizado no topo (~7% da altura), branco 70%, com um **ponto laranja** à esquerda.
- **Legenda karaokê** no terço inferior-central (~70% da altura na cena com interface; ~85% nas demais).

---

## 3. Legenda dinâmica (karaokê) — OBRIGATÓRIO

- Fica dentro de uma **pílula preta** arredondada, com 3–5 palavras por vez.
- Estados das palavras:
  - já falada → **branco**
  - sendo falada agora → **laranja**
  - ainda vai ser falada → **cinza**
- A frase da narração é quebrada em blocos curtos que trocam junto com a fala (ex.: "e montou este" → "vídeo em 3D.").
- A pílula entra com *pop* leve (escala 0,9 → 1,0 em ~120 ms).

---

## 4. Estrutura do roteiro (9 blocos) — OBRIGATÓRIO

| # | Tempo | Função | Visual | Exemplo de fala |
|---|---|---|---|---|
| 1 | 0–2 s | **Gancho** | Objeto 3D único e icônico do tema sobre fundo escuro/estrelado, girando devagar | "O tema era só uma pergunta:" |
| 2 | 2–3 s | **A pergunta** | Janela do Claude Code (aba **Code** ativa) flutuando em 3D, inclinada; o cursor digita o tema no campo e clica em enviar | "e se o Sol apagasse?" |
| 3 | 3–8 s | **O que a IA fez** | Estúdio azul/laranja; grade 2×2 de cartões 3D (lupa, documento, microfone, celular) com rótulos PESQUISOU / ESCREVEU / NARROU / MONTOU; cada um recebe **check verde** e borda laranja em sequência | "O Claude Code pesquisou, escreveu, narrou e montou este vídeo em 3D." |
| 4 | 8–11 s | **Simplicidade p/ o usuário** | Volta para a janela do Claude Code: mensagem do usuário + resposta "Roteiro pronto. Você aprova?" com botão laranja **Aprovar**; cursor clica | "Você escolhe o tema e aprova, e o Claude Code…" |
| 5 | 11–15 s | **Prova 1 (volume)** | Parede/grade 5×3 de celulares com vídeos do perfil; título "+20 milhões / de visualizações" com contador subindo (13 → 20) | "Esses vídeos somaram mais de 20 milhões de visualizações" |
| 6 | 15–18 s | **Prova 2 (crescimento)** | Cartão de perfil 3D com avatar laranja, botão "✓ Seguindo" e bolinhas coloridas; "+100 mil / seguidores em menos de 15 dias" | "e 100 mil seguidores em menos de 15 dias." |
| 7 | 18–22 s | **Oferta** | Fundo vira laranja quente. Cartão preto inclinado: "De ~~R$ 97~~ por apenas" / **R$ 47** gigante laranja / selo "por tempo limitado" | "De R$ 97 por apenas R$ 47, por tempo limitado," |
| 8 | 22–23 s | **Ancoragem de preço** | Objeto 3D do cotidiano (pizza) com etiqueta "menos que uma pizza" | "menos que uma pizza." |
| 9 | 23–27 s | **CTA** | Leque de 5 celulares 3D mostrando vídeos prontos (o do centro troca de vídeo); botão laranja grande **"Saiba mais ↓"** | "Toque em Saiba mais e comece hoje." |

Regras de roteiro:
- O **tema do vídeo é sempre uma pergunta curiosa** ("E se…?") e ela aparece *dentro* da interface.
- O vídeo é **metalinguístico**: ele mesmo é a prova ("…e montou **este** vídeo").
- Só **2 números de prova** e **1 preço**. Nada de listas longas.
- Frases curtas, ritmo rápido, sem pausas.

---

## 5. Estilo 3D e animação

- Render 3D "clay/estilizado": formas simples, materiais suaves, leve brilho de borda (rim light) laranja.
- Câmera sempre se movendo um pouco (push-in lento ou leve órbita) — nunca totalmente parada.
- Interface (janela do app) também em 3D: plano inclinado ~10–15°, sombra projetada, brilho laranja atrás.
- Transições: corte seco ou *zoom-through* rápido (≤ 200 ms). Não usar transições "de PowerPoint".
- Micro-animações: checks com *pop*, números com contador, cursor com clique em círculo laranja, botões com leve *bounce*.
- Estúdio das cenas de prova: parede com grade de painéis, refletores no teto, piso reflexivo com faixa laranja no horizonte.

---

## 6. Checklist final antes de publicar

- [ ] 9:16, 30 fps, 20–30 s
- [ ] Gancho com objeto 3D + frase nos 2 primeiros segundos
- [ ] Pergunta do tema aparece digitada na janela do Claude Code
- [ ] Grade PESQUISOU / ESCREVEU / NARROU / MONTOU com checks
- [ ] Cena "você aprova" com botão Aprovar
- [ ] 2 provas numéricas (visualizações + seguidores)
- [ ] Oferta com preço riscado + preço novo + "por tempo limitado"
- [ ] Ancoragem ("menos que uma pizza" ou similar)
- [ ] CTA "Saiba mais ↓" + "comece hoje"
- [ ] @handle com ponto laranja no topo em todas as cenas
- [ ] Legenda karaokê (branco / laranja / cinza) em todas as falas
- [ ] Laranja como única cor de destaque; azul só no fundo das cenas de prova
- [ ] Narração sem silêncios; nada importante fora da área segura

---

## 7. Modelo de roteiro para preencher

```
TEMA (pergunta): "E se ______?"
OBJETO 3D DO GANCHO: ______
NÚMERO 1: +____ de visualizações
NÚMERO 2: +____ seguidores em menos de __ dias
PREÇO: De R$ __ por R$ __ (por tempo limitado)
ANCORAGEM: "menos que ______"

NARRAÇÃO:
O tema era só uma pergunta: e se ______?
O Claude Code pesquisou, escreveu, narrou e montou este vídeo em 3D.
Você escolhe o tema e aprova, e o Claude Code faz o resto.
Esses vídeos somaram mais de ____ de visualizações
e ____ seguidores em menos de __ dias.
De R$ __ por apenas R$ __, por tempo limitado,
menos que ______.
Toque em Saiba mais e comece hoje.
```

> Observação: números de visualizações/seguidores e preços devem ser reais e verificáveis do seu próprio perfil/produto — não copie os da referência.
