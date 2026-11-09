# Estúdio de séries POV

Esta pasta é um estúdio para criar séries POV curtas e verticais (Reels, TikTok, Shorts). **POV** quer dizer primeira pessoa: a câmera é o olho do protagonista, e quem assiste é o protagonista. Os vídeos são em 3D, e o público decide no fim de cada parte o que o protagonista faz. Quem está do outro lado pode ser iniciante: explique sem termo técnico e um passo por vez.

## Primeira vez
Se a pessoa ainda não montou o estúdio (não existe a pasta `projeto/`), siga o `COMECE-AQUI.md`.

## Organização
- `series/<nome>/`: tudo de uma série. `biblia.md` (personagens, a voz do narrador, estado atual, regras, placar e histórico de votos), `banco-de-problemas.md`, `briefing.md`, `perfil.md`, `prancha/` e uma pasta por parte (`ep01/`, `ep02/`...) com roteiro, narração para o ElevenLabs, áudios e prévias.
- `projeto/`: o código dos vídeos (Remotion com Three.js para o 3D). Cada série tem a sua pasta em `projeto/src/<série>/`.
- `entregas/AAAA-MM-DD_nome/`: vídeo final, capa, roteiro e legenda do post.
- `referencias/<nome>/`: vídeos e imagens de referência, com a `analise.md` (estrutura × identidade).

## Antes de qualquer parte
1. Leia a `biblia.md` e o `banco-de-problemas.md` da série.
2. Confira com a pessoa o resultado do voto **de cada plataforma** (Instagram, TikTok e YouTube). O resultado é sempre o real.
3. Roteiro (a narração e a imagem de cada cena) → aprovação → narração para o ElevenLabs → só então a produção.

## Três plataformas: Instagram, TikTok e YouTube
- Cada plataforma (Instagram, TikTok e YouTube Shorts) é uma **linha da história própria**, que segue o voto do seu público.
- Plataformas que tiveram **exatamente os mesmos resultados em todos os votos** dividem a mesma linha e usam **o mesmo vídeo**.
- No primeiro voto diferente, a plataforma que votou diferente **se separa** e não volta mais a dividir, mesmo que os votos voltem a coincidir. Pode acontecer de duas seguirem juntas e uma se separar, ou de as três se separarem.
- Cada linha separada tem o seu roteiro, a sua narração, o seu vídeo, a sua capa e a sua legenda.
- A bíblia guarda **um estado, um placar e um histórico de votos para cada plataforma**. Ao separar, copie o estado comum para a nova linha e siga cada uma.
- Pastas: enquanto as três estão juntas, `series/<nome>/epNN/`. Depois de separar, uma pasta por linha, com o nome das plataformas que ela atende: ex. `ep02-instagram-tiktok/` e `ep02-youtube/`, ou `ep03-instagram/`, `ep03-tiktok/` e `ep03-youtube/`. As entregas seguem o mesmo padrão: `entregas/AAAA-MM-DD_nome-epNN-<plataformas>/`.

## Regras de criação
- Fale em português do Brasil.
- Formato: 1080×1920, 30 fps. Áudio normalizado em −14 LUFS.
- Duração mínima: todo vídeo tem **no mínimo 1 minuto** (60 s), para fins de monetização. O normal no POV é de 1 min 30 s a 2 min 30 s. O tempo a mais vem de história que empurra o mistério, nunca de enrolação ou cena parada.
- **Uma voz só: o protagonista narra.** Ele conta a história em primeira pessoa, falando com quem assiste, com frases curtas e pausas antes do que assusta. Os outros personagens não têm voz: o que eles dizem chega pela narração ("ele disse que...") ou escrito na tela (mensagens, áudios, o celular, placas, bilhetes). A narração cabe no tempo do vídeo: cerca de 150 palavras por minuto.
- Nunca copie personagem, nome, piada, arte ou música de outra pessoa. Referência serve só de estrutura. Nunca use nome de famoso ou de pessoa real.
- A piada nunca é o físico nem a pobreza.
- Série em partes: toda parte abre com o selo **"<SÉRIE> · PARTE N"** e um título curto.
- Voto no fim de cada parte: **"O QUE VOCÊ FARIA?"** com duas ações de 2 a 4 palavras. Cada ação tem **uma palavra em destaque** para o público comentar (ex.: "**OBEDECER** o menino" ou "**IR** ao encontro"). As duas opções precisam ser difíceis: nenhuma é a certa.
- Nunca punir o voto: a parte do vencedor é uma vitória. Não mostrar a % de quem ganhou, só "Vocês escolheram: X".
- Continuidade: o estado do protagonista segue entre as partes. O que mudou continua mudado.
- O dinheiro (ou o recurso da série) é finito e as contas fecham.
- Começo impactante: os **primeiros 3 segundos** prendem a pessoa. O vídeo abre direto no momento mais forte da parte (a ameaça, o susto, a descoberta ou a pergunta sem resposta), com uma fala curta. Pode ser um trecho do fim da parte, seguido de "Horas antes". Nunca abrir com apresentação calma, paisagem ou "esse é o...".
- Começo que explica: logo depois do impacto, até os 15 segundos, o que está acontecendo e o que está em jogo (de preferência por uma tela ou uma fala, não por explicação).
- Toda cena empurra a história: cada cena avança o mistério ou o objetivo. Se não avança, sai.
- Final com ameaça: toda parte termina com algo em jogo para a próxima, logo antes do voto.

## Regras de arte (POV em 3D)
- **A câmera é o olho do protagonista.** O rosto dele nunca aparece. O público vê só o que ele veria: as mãos, os braços, o que ele segura e o que tem na frente.
- Lente curva (olho de peixe leve), como câmera de capacete, em todas as cenas. A câmera respira e balança de leve; ao andar ou ao virar a cabeça, o movimento é suave, nunca um tranco.
- **Nunca mude as mãos, as roupas ou os objetos fixos do protagonista sem pedido** (ex.: a luva com o dedo rasgado). O que muda é registrado no "estado atual" da bíblia.
- Siga o estilo escolhido na prancha da série (cores, luz e acabamento). Nunca troque o estilo sem pedido.
- Personagens que conversam com o protagonista olham para a câmera.
- Cenas completas, sempre: nada de fundo liso. Todo cenário tem objetos que contam onde estamos.
- Nada solto no cenário: tudo apoiado em algo. Cada objeto precisa parecer o que é.
- **Legenda no meio da tela:** a narração, branca, em fonte grossa com contorno escuro. O que os outros escrevem aparece na própria tela da cena (celular, papel, placa). A legenda nunca cobre rosto, celular ou informação.
- Telas (celular, painel) são parte da cena e precisam ser legíveis num close. Confira cada número contra a bíblia.
- Revise as mãos em todo plano novo (dedo a mais, objeto atravessando a mão, braço saindo do lugar errado).
- Antes de renderizar, confira cada semente plantada num close grande.
- Sem áudio repetitivo em loop: ambiente baixo (motor, rua, chuva) e efeitos pontuais.

## Vozes
- **Uma voz por série:** a do protagonista narrador, fixa no ElevenLabs e anotada na bíblia. Nunca troque a voz sem pedido.
- Depois do roteiro aprovado, entregue `epNN/falas-para-elevenlabs.txt`: a narração dividida em blocos numerados, na ordem do vídeo, um bloco por cena, com o nome do arquivo de cada um (ex.: `01-abertura.mp3`). As reticências marcam pausas.
- A pessoa gera os áudios com a conta dela e coloca os arquivos em `epNN/audios/` com o nome indicado em cada bloco. O Claude não cria conta nem usa serviço pago.

## Como trabalhar
- Mostre prévias em folha de quadros (vários quadros numa imagem) antes do render final, e só avance com aprovação.
- O trabalho pesado roda no computador (render, transcrição, mixagem): rode o script e leia só o resumo.
- Depois de cada parte publicada, atualize a bíblia com o "estado após a parte" e o resultado do voto.
- Ao finalizar uma parte, entregue junto a legenda do post (`legenda-do-post.txt` na pasta da entrega e no chat, pronta para copiar), sempre nesta estrutura:
  ```
  <SÉRIE> · PARTE <n> | <título da parte> <emoji>
  <o que aconteceu, em 1 ou 2 frases curtas, falando com "você">
  <o gancho: a ameaça ou a dúvida, em 1 frase> 👀

  🗳️ O QUE VOCÊ FARIA? <OPÇÃO 1> ou <OPÇÃO 2>?
  Comente <PALAVRA 1> ou <PALAVRA 2>.
  A próxima parte é o que vocês escolherem.

  #<perfil> #<série> #pov #<gênero>
  ```
- Ao finalizar uma parte, entregue também a capa (`capa.png`, 1080×1920), feita a partir de um molde em `projeto/src/<série>/Capa.tsx` (crie o molde na Parte 1 e, nas seguintes, troque só os textos e a cena):
  - um quadro forte da própria parte, em POV, no estilo da série;
  - selinho com o nome da série no alto;
  - "PARTE <n>" grande, com o número em destaque;
  - o título da parte;
  - uma frase curta com o gancho ou a ameaça.
  A capa **não** leva o voto: o voto fica no vídeo e na legenda.
  Tudo o que importa fica dentro do recorte da grade do perfil (o meio da imagem, sem os 240 px de cima e de baixo). Confira a capa recortada antes de entregar.
- Quando a pessoa corrigir algo importante, pergunte se deve virar regra neste arquivo.
- Confira cada coisa criada. Se der erro, leia a mensagem inteira, explique em uma linha (sem termo técnico) e tente corrigir. Se a correção precisar baixar algo, avise antes com o tamanho.

## Dinheiro e downloads
- Nunca use API paga nem crie conta sem a pessoa pedir.
- Avise antes de baixar qualquer coisa, dizendo o que é e o tamanho.
