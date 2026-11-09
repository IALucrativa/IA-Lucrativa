# Portfólio do Instagram

Esta pasta é uma cópia do estúdio de séries usada **só para o perfil do Instagram** (@vocedecideai.tv): destaques, carrosséis, Stories, posts de grade, bio, posts fixados e o plano de postagem. O objetivo é **engajar o perfil e aumentar o alcance**. Aqui não se cria episódio, roteiro de episódio nem vídeo de episódio (isso é no estúdio). Quem está do outro lado pode ser iniciante: fale simples, sem termo técnico, um passo por vez.

## Primeira vez
Se a pessoa está abrindo esta pasta pela primeira vez, siga o `COMECE-AQUI.md`.

## Organização
- `portfolio/plano.md`: o que já foi postado, o que está fixado, os destaques que existem e o próximo passo. **Leia no começo de toda sessão e atualize ao final.**
- `projeto/src/perfil/Portfolio.tsx`: os moldes das peças do perfil (destaques, carrosséis "Arquivo do caso" e "Quem é o Rodnei", Stories). `Perfil.tsx`: carrossel "Como funciona" e os dois primeiros destaques.
- `entregas/AAAA-MM-DD_portfolio-<nome>/`: as imagens prontas, a legenda (`legenda-*.txt`) e um guia curto de como postar.
- `series/<nome>/`: só para **consulta** (bíblia, perfil, roteiros). Não altere a bíblia daqui, a não ser que a pessoa peça.
- `projeto/src/bilhete/`: o personagem e os cenários. Use, mas não mude o desenho.

## Antes de criar qualquer peça
1. Leia `portfolio/plano.md`, `series/bilhete-na-porta/perfil.md` e a parte "Estado após o Ep. N" mais recente da `biblia.md`.
2. Pergunte (com botões, se der) qual foi o último episódio publicado e, se já houver, o resultado do voto **de cada plataforma**.
3. Mostre a prévia (folha com todas as telas lado a lado) antes de entregar a versão final.

## Tamanhos
| Peça | Tamanho | Cuidado |
|---|---|---|
| Post de feed e carrossel | 1080×1350 | A grade do perfil corta um pouco dos lados: deixe cerca de 40 px livres na esquerda e na direita. |
| Story | 1080×1920 | Nada importante nos 250 px de cima e nos 340 px de baixo (barra do Instagram e campo de resposta). |
| Capa de Reels (episódio) | 1080×1920 | Feita no estúdio, com o molde `Capa.tsx`. Aqui só se confere o recorte da grade. |
| Capa de destaque | 1080×1920 | O Instagram só mostra o **círculo do meio**: ícone simples, sem texto, fundo amarelo, ícone azul-escuro. |
| Foto de perfil | 1080×1080 | Já escolhida (opção C). Não trocar sem pedido. |

## Regras de arte
- Mesmo estilo de sempre: fundo noturno roxo com lua e prédio, títulos brancos com contorno preto e a palavra-chave em **amarelo** (`#ffcc33`), selinho branco no alto, cartões com contorno.
- **Nunca mude o rosto ou o corpo do Rodnei.** Personagens que ainda não têm desenho (Tânia, Marlene, a sombra) aparecem só como **silhueta com "?"**, até o estúdio desenhá-las.
- Nada solto: todo objeto apoiado em algo. Nada cobre o rosto do personagem.
- Carrossel: setinha "deslize →" e pontinhos de página em todas as telas menos a última. **A última tela sempre pede uma ação** (comentar, salvar, compartilhar, marcar um amigo, seguir).
- Story: deixe um **espaço tracejado** onde a pessoa vai colar a figurinha do Instagram (enquete, contagem, caixinha, quiz). O tracejado some quando a figurinha fica por cima.
- Confira cada imagem pronta (abra e olhe) antes de entregar: texto cortado, emoji cortado, nada cobrindo nome ou rosto.

## Regras de conteúdo
- Português do Brasil, tom do canal (Você Decide Aí): curioso, de suspense, com humor leve.
- **Nunca dê spoiler.** Só use o que o público já viu nos episódios publicados. Nunca revele quem escreve os bilhetes nem o segredo do Rodnei (a chave mestra). Nunca confirme nem negue uma teoria.
- Nunca mostre a porcentagem ou o placar do voto. Só "Vocês escolheram: X".
- Nunca prometa o que não está decidido (data de fim, sorteio, prêmio, episódio extra).
- Nada de política, religião, nome de famoso ou de pessoa real. A piada nunca é o físico nem a pobreza.
- Nunca copie arte, personagem, música ou texto de outro perfil. Referência serve só de estrutura.
- Se as plataformas já se separaram (ver a bíblia), o conteúdo do Instagram segue a linha da história **do Instagram**.

## O que faz o perfil crescer (use isso para decidir o que criar)
- **Salvar e compartilhar** pesam mais que curtir: carrossel de pistas, "Arquivo do caso" e recapitulações são feitos para serem salvos. Sempre peça para salvar ou mandar para um amigo na última tela.
- **Comentário** é o voto da série: toda legenda termina com uma pergunta de uma palavra.
- **Marcar amigo** traz gente nova: use em post de personagem ("marque o amigo medroso").
- **Stories todo dia** mantêm quem já segue: enquete do voto, contagem para as 12h, caixinha de perguntas, quiz de memória e o resultado do voto.
- **Destaques** organizam o perfil para quem chega: a pessoa entende a série em 10 segundos.
- **Posts fixados**: Como funciona → Ep. 1 → episódio mais recente.
- **Constância**: episódio às 12h; Stories de manhã (resultado) e à noite (votação aberta).
- Hashtags: de 3 a 5, sempre `#vocedecideai` e `#bilhetenaporta`, mais 1 a 3 do tema (`#misterio`, `#serieanimada`, `#suspense`).

## Legenda dos posts do perfil (não episódio)
```
<TÍTULO EM CAIXA ALTA> <emoji>
<1 ou 2 frases que fazem a pessoa querer deslizar>

<a pergunta ou o pedido de ação: comentar, salvar, marcar>
Ep. novo todo dia, 12h. 🔔

#vocedecideai #bilhetenaporta #<tema> #<tema>
```
Entregue a legenda num `legenda-*.txt` na pasta da entrega e no chat, pronta para copiar. Escreva também o **texto alternativo** (descrição da imagem para quem não enxerga) em uma frase.

## Como trabalhar
- Para renderizar: `cd projeto` e `npx remotion still src/index.ts <Composição> <arquivo.png> --props='{...}'`. As composições do portfólio são `DestaqueNovo`, `ArquivoDoCaso`, `QuemEORodnei`, `Story`, `ComoFunciona` e `Destaque`.
- Para um carrossel novo de outro episódio, copie o molde (`ArquivoDoCaso`) e troque só os textos e as pistas daquele episódio.
- Ao final de cada sessão, atualize `portfolio/plano.md` (o que foi entregue, o que a pessoa postou, o próximo passo).
- Quando a pessoa corrigir algo importante, pergunte se deve virar regra neste arquivo.
- Se der erro, leia a mensagem inteira, explique em uma linha (sem termo técnico) e tente corrigir.

## O que fica de fora
- `entregas/` antigas, `referencias/`, `entrevista-da-serie.md` e os arquivos de episódio vieram do estúdio: servem só de consulta.
- Nunca use API paga, nunca crie conta e nunca poste nada no Instagram pela pessoa. Quem posta é ela.
- Avise antes de baixar qualquer coisa, dizendo o que é e o tamanho.
