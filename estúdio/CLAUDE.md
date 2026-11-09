# Estúdio de séries

Esta pasta é um estúdio para criar séries animadas curtas e verticais (Reels, TikTok, Shorts) em que o público vota no próximo episódio. Quem está do outro lado pode ser iniciante: explique sem termo técnico e um passo por vez.

## Primeira vez
Se a pessoa ainda não montou o estúdio (não existe a pasta `projeto/`), siga o `COMECE-AQUI.md`.

## Organização
- `series/<nome>/`: tudo de uma série. `biblia.md` (personagens, estado atual, regras, placar e histórico de votos), `banco-de-problemas.md`, `briefing.md`, `perfil.md` e uma pasta por episódio (`ep01/`, `ep02/`...) com roteiro e prévias.
- `projeto/`: o código dos vídeos (Remotion).
- `entregas/AAAA-MM-DD_nome/`: vídeo final, capa, roteiro e legenda do post.
- `referencias/<nome>/`: vídeos e imagens de referência.

## Antes de qualquer episódio
1. Leia a `biblia.md` e o `banco-de-problemas.md` da série.
2. Confira com a pessoa o resultado do voto **de cada plataforma** (Instagram e TikTok). O resultado é sempre o real.
3. Roteiro curto (o texto da narração) → aprovação → só então a produção.

## Duas plataformas: Instagram e TikTok
- Cada plataforma é uma **linha da história própria**, que segue o voto do seu público.
- Enquanto os votos forem iguais nas duas, faça **um vídeo só** e use nos dois lugares.
- No primeiro voto diferente, a história **se separa** e não se junta mais: dali em diante, cada plataforma tem o seu roteiro, a sua narração, o seu vídeo, a sua capa e a sua legenda, mesmo que os votos voltem a coincidir.
- A bíblia guarda **um estado, um placar e um histórico de votos para cada plataforma**. Ao separar, copie o estado comum para as duas e siga cada uma.
- Pastas depois da separação: `series/<nome>/epNN-instagram/` e `epNN-tiktok/`; entregas em `entregas/AAAA-MM-DD_nome-epNN-instagram/` e `...-tiktok/`. Antes da separação, `epNN/` serve às duas.

## Regras de criação
- Fale em português do Brasil.
- Formato: 1080×1920, 30 fps. Áudio normalizado em −14 LUFS.
- Duração mínima: todo vídeo tem **no mínimo 1 minuto** (60 s), para fins de monetização. Planeje o roteiro já com isso (cerca de 150 a 170 palavras de narração). O tempo a mais vem de história que empurra o mistério, nunca de enrolação ou cena parada.
- Nunca copie personagem, nome, piada, arte ou música de outra pessoa. Referência serve só de estrutura. Nunca use nome de famoso ou de pessoa real.
- A piada nunca é o físico nem a pobreza; é o jeito de resolver.
- Voto: duas opções de uma palavra. Nunca punir o voto: o episódio do vencedor é uma vitória. Não mostrar a % de quem ganhou, só "Vocês escolheram: X".
- Continuidade: o estado do personagem segue entre os episódios. O que mudou continua mudado.
- O dinheiro (ou o recurso da série) é finito e as contas fecham.
- Começo impactante (a partir do Ep. 2, sempre que a história permitir): os **primeiros 3 segundos** prendem a pessoa. O vídeo abre direto no momento mais forte do episódio (a ameaça, o susto, a descoberta ou a pergunta sem resposta), com imagem que chama atenção e uma frase curta de narração. Nunca abrir com apresentação calma, paisagem ou "esse é o...".
- Começo que explica: logo depois do impacto, até os 10 segundos, quem é o personagem, o que está acontecendo e o que ele quer.
- Toda cena empurra a história: cada cena avança o mistério ou o objetivo. Se não avança, sai (nada de enrolação ou problema solto).
- Final com ameaça: todo episódio termina com algo em jogo para o próximo, não só uma surpresa.

## Regras de arte
- O personagem é um boneco articulado em código. **Nunca mude o rosto ou o corpo do personagem sem pedido.** Foto ou vídeo de referência guia só o movimento e a pose.
- Cenas completas, sempre: nada de fundo liso. Todo cenário tem objetos que contam onde estamos.
- Nada solto no cenário: tudo apoiado em algo. Cada objeto precisa parecer o que é.
- A legenda nunca cobre rosto, balão ou informação.
- Revise o corpo do personagem em todo plano novo (braço duplicado, objeto atravessando, roupa atrás do tronco).
- Antes de renderizar, confira cada semente plantada num close grande.
- Sem áudio repetitivo em loop: fundo baixo e efeitos pontuais.

## Como trabalhar
- Mostre prévias em folha de quadros (vários quadros numa imagem) antes do render final, e só avance com aprovação.
- O trabalho pesado roda no computador (render, transcrição, mixagem): rode o script e leia só o resumo.
- Depois de cada episódio publicado, atualize a bíblia com o "estado após o episódio" e o resultado do voto.
- Ao finalizar um episódio, entregue junto a legenda do post (`legenda-do-post.txt` na pasta da entrega e no chat, pronta para copiar), sempre nesta estrutura:
  ```
  EP. <n> | <título do episódio> <emoji>
  <o que aconteceu, em 1 ou 2 frases curtas>
  <o gancho: a ameaça ou a dúvida, em 1 frase> 👀

  🗳️ VOCÊ DECIDE: <a pergunta do voto>?
  Comente <OPÇÃO 1> ou <OPÇÃO 2>.
  O próximo episódio é o que vocês escolherem. Amanhã, 12h.

  #vocedecideai #<série> #<gênero> #serieanimada
  ```
- Ao finalizar um episódio, entregue também a capa (`capa.png`, 1080×1920) no estilo padrão, feita com o molde `projeto/src/bilhete/Capa.tsx` (troque só os textos e a pose):
  - selinho com o nome da série no alto;
  - "EPISÓDIO <n>" grande, com o número em amarelo;
  - faixa amarela inclinada com o placar ou prazo (ex.: "FALTAM 29 NOITES");
  - selinho escuro com o gancho do episódio;
  - o personagem no centro, no cenário do episódio;
  - cartão inclinado com a ameaça e uma faixa vermelha embaixo;
  - etiqueta curta do personagem.
  A capa **não** leva a barra de voto ("VOCÊ DECIDE ... ou ..."): o voto fica no vídeo e na legenda.
  Tudo o que importa fica dentro do recorte da grade do perfil (o meio da imagem, sem os 240 px de cima e de baixo), e nada cobre o rosto. Confira a capa recortada antes de entregar.
- Quando a pessoa corrigir algo importante, pergunte se deve virar regra neste arquivo.
- Confira cada coisa criada. Se der erro, leia a mensagem inteira, explique em uma linha (sem termo técnico) e tente corrigir. Se a correção precisar baixar algo, avise antes com o tamanho.

## Dinheiro e downloads
- Nunca use API paga nem crie conta sem a pessoa pedir.
- Avise antes de baixar qualquer coisa, dizendo o que é e o tamanho.
