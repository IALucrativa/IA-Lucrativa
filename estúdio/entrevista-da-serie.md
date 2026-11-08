# Entrevista da série

Roteiro de perguntas e respostas para tirar a série da sua cabeça e montar a primeira versão da bíblia. Abra o Claude no Code, na pasta do estúdio, e escreva:

> Leia `entrevista-da-serie.md` e me entreviste para criar a minha série.

O resto é conversa. O aluno responde do jeito dele e manda vídeos, prints ou links de referência quando tiver. No fim, o Claude entrega os arquivos da série prontos.

---

## Instruções para o Claude (como conduzir)

- Fale em português do Brasil, de forma simples, sem termo técnico. A pessoa pode nunca ter usado o Claude.
- **No máximo 3 perguntas por vez.** Espere a resposta antes de seguir.
- **Use botões sempre que der.** Se a ferramenta de perguntas com opções estiver disponível (no Claude Code, `AskUserQuestion`), use-a no máximo de perguntas possível: 2 a 4 opções curtas, com uma linha de explicação cada; a pessoa sempre pode escrever a própria resposta em "Outro". Até pergunta aberta vira botão com sugestões (ex.: "o que você não quer?" com 4 opções marcáveis; "tem referência?" com "não tenho", "vou mandar o link em Outro", "me sugira algumas"). Iniciante trava menos clicando do que escrevendo do zero. **Botões do começo ao fim, sem exceção:** link e descrição viram botão ("vou escrever em Outro", "me sugira opções", "pular por agora").
- **Ao citar o exemplo do curso,** apresente sempre: "na série O Cara da Foto, que é o exemplo do curso, o Cleiton...". Nunca fale do Cleiton como se o aluno já o conhecesse.
- **Pergunta pulada não trava a entrevista.** Anote como "a decidir" e volte nela mais tarde, no próximo bloco que fizer sentido.
- **Quando a pessoa não tem ideia,** ofereça "me sugira" e traga 3 opções diferentes de verdade, todas originais.
- **Não peça para a pessoa escrever a premissa do zero.** No Bloco 3, junte o lugar, o motivo, o prazo e o voto já respondidos em 3 premissas de uma frase e deixe ela escolher (funcionou no teste). Sem a ferramenta, faça as mesmas perguntas em texto, com as opções numeradas.
- **Toda pergunta vem com um exemplo** (de O Cara da Foto ou inventado) e, quando fizer sentido, com 2 ou 3 opções para escolher. "Não sei" é uma resposta válida: proponha opções e deixe a pessoa escolher.
- **Ao fim de cada bloco, resuma em 3 linhas** o que entendeu e pergunte se está certo.
- Se a pessoa já respondeu algo de um bloco seguinte, não pergunte de novo.
- Se uma resposta fura uma regra (copia personagem de alguém, ri do físico ou da pobreza, usa nome de famoso ou de pessoa real), diga uma vez o risco, de forma gentil, e proponha uma alternativa.
- **Vídeo de referência:** peça para salvar em `referencias/<nome>/video.mp4` (ou mandar o link para a própria pessoa baixar). Analise o vídeo (extraia alguns quadros com `npx remotion ffmpeg`, se o projeto já estiver instalado; senão, peça 3 ou 4 prints das cenas principais) e devolva duas listas: **estrutura** (pode usar) e **identidade** (não pode copiar).
- Não invente números, resultados ou fatos da vida da pessoa. O que ela não decidir fica marcado como "a decidir".
- Rode tudo localmente. Nada de API paga.
- A entrevista pode ser feita em mais de um dia. Salve as respostas em `series/<nome>/entrevista.md` ao fim de cada bloco, para continuar de onde parou.

---

## Bloco 1: Você e o seu objetivo
1. Em qual rede você vai postar primeiro? *(Ex.: só Instagram no começo; depois os mesmos vídeos no TikTok e no Shorts.)*
2. Quanto tempo por dia você tem para a série? *(Ex.: 2 horas à noite; isso define se dá para postar todo dia.)*
3. O que você quer com a série: seguidores, vender algo depois, diversão, portfólio?
4. Você já usou o Claude ou alguma IA? Já mexeu com edição de vídeo? *(Nenhum dos dois é obrigatório.)*

## Bloco 2: Referências e gosto
1. Tem alguma série, canal ou vídeo que te inspira? Pode mandar o vídeo ou o link.
2. O que exatamente te prende nele? *(Ex.: o público votar, o personagem sofrer de um jeito engraçado, o desenho.)*
3. Que tipo de humor ou tom você quer? *(Opções: comédia de situação, drama leve, mistério, documentário irônico.)*
4. O que você **não** quer na sua série?

> **Exemplo real:** a referência de O Cara da Foto tinha "Vocês escolheram: roupas", três tentativas com X vermelho e "+3%". Ficou a mecânica; o personagem, os nomes, as piadas e a arte foram criados do zero.

## Bloco 3: A premissa
1. Em uma frase: quem é o personagem e o que ele precisa conseguir?
2. Qual é o prazo e como o público vai ver o progresso? *(Ex.: 30 dias e uma porcentagem de "parecido com a foto".)*
3. Por que o público precisa ajudar? O que ele decide?

**Checklist (o Claude confere e mostra o resultado):**
- [ ] Cabe em uma frase, que cabe na bio?
- [ ] Tem prazo e meta mensuráveis?
- [ ] O público consegue mudar o resultado?
- [ ] Tem pelo menos 10 problemas possíveis?
- [ ] O protagonista é carismático mesmo errando?
- [ ] Tudo é 100% seu?

> **Exemplo real:** "Ele mandou a única foto boa da vida dele. Agora tem 30 dias pra virar esse cara."

## Bloco 4: O protagonista
1. Nome, idade e o que ele faz da vida.
2. Qual é o defeito engraçado dele e o que ele mais quer?
3. Como ele está **hoje**, visualmente? Liste roupas, cabelo e objetos. *(Isso vira o "estado atual" que muda a cada episódio.)*
4. Ele tem algum segredo que o público ainda não sabe?

> **Exemplo real:** Cleiton, 29, conserta celular, mulambento por desleixo: boné vermelho de autopeças, barba falhada, dente faltando, camiseta "Corrida 5K 2014" rasgada. Ele também tem um segredo que o público ainda não conhece (e que não vamos contar aqui).
> **Regra:** a piada é o desleixo e o jeito de resolver, nunca o físico nem a pobreza.

## Bloco 5: O elenco
1. Quem é a meta (a pessoa ou a coisa que ele quer alcançar)? Ela aparece ou fica em mistério?
2. Quem ajuda e quem atrapalha? Pense em 1 ou 2 personagens secundários fortes.
3. Algum lugar fixo (loja, vizinhança, trabalho) onde a história sempre volta?

> **Exemplo real:** a Bia quase não aparece, só fala por mensagem. A Dona Neide, vizinha de 71 anos, começou como um dedo de unha vermelha e virou favorita do público.

## Bloco 6: O mundo e as regras
1. Existe dinheiro, energia ou outro recurso limitado? Quanto ele tem no começo?
2. Como o tempo passa? *(Ex.: 2 a 3 dias da história por episódio.)*
3. O que nunca pode acontecer na série? *(Ex.: mostrar o rosto da foto antes do final.)*

> **Exemplo real:** o dinheiro é finito e as contas aparecem na tela. Com R$ 15, "não há episódio que se pague": a série precisou de uma fonte de dinheiro (pizzaria + consertos).

## Bloco 7: O voto
1. Que tipo de escolha o público faz? *(O que ele melhora primeiro, para onde vai, quem ajuda.)*
2. Quais seriam as duas opções do primeiro voto? Uma palavra cada.
3. Como mostrar o progresso? *(%, barra, mapa, checklist de conquistas.)*

**Se a pessoa escolher votar só por enquete,** mostre o dado do exemplo do curso antes de fechar o bloco: aos 30 min, 374 comentários com enquete contra 954 com voto por comentário. No teste, esse aviso fez a pessoa trocar para comentário + enquete no Story.

**Regras que o Claude explica:** duas opções de uma palavra; resultado sempre real; nunca punir o voto (o episódio do vencedor é vitória); o que perde piora em silêncio; dois problemas e dinheiro para um só.

## Bloco 8: Problemas e sementes
1. Liste tudo o que pode dar errado na vida dele. *(O Claude ajuda até passar de 15.)*
2. Qual problema vai perder vários votos e crescer quieto, esperando? *(Em O Cara da Foto, a barba.)*
3. Que detalhes pequenos dá para plantar no fundo da cena, sem falar nada, para o público notar? *(Ex.: espinhas que se multiplicam, um envelope de conta fechado.)*

## Bloco 9: Estilo e voz
1. Como você imagina o desenho? Tem uma imagem de um estilo que você ama? Pode mandar. *(Botões: "vou mandar uma imagem", "me mostre opções na prancha", "já sei, vou descrever". A imagem serve só de guia de traço, cor e acabamento: o personagem continua 100% seu.)*
2. Quem narra e em que tom? *(Ex.: um narrador só, tom de documentário irônico.)*
3. Você vai gravar a voz ou gerar no ElevenLabs?

> **Exemplo real:** venceu o cartoon colorido com contorno escuro e olhos expressivos. Sem contorno, preto e branco e cabeça quadrada foram rejeitados.

## Bloco 10: Ritmo
1. Quantos episódios por semana você consegue manter sem se esgotar?
2. Qual horário fixo de postagem?
3. Topa ter sempre o próximo roteiro adiantado antes de prometer data ao público?

> **Regra:** constância vence quantidade. Em O Cara da Foto, um episódio por dia, sempre por volta das 12h.

---

## O que o Claude entrega no fim

Na pasta `series/<nome>/`:

| Arquivo | Conteúdo |
|---|---|
| `entrevista.md` | Todas as perguntas e respostas, com data |
| `biblia.md` | Premissa, personagens, estado atual, regras, segredos, placar inicial, histórico de votações (vazio) e calendário interno |
| `banco-de-problemas.md` | Os 15+ problemas, as sementes e o problema que "cresce esperando" |
| `briefing.md` | Objetivo, público, rede, ritmo, estilo, voz e o que não pode ter |
| `perfil.md` | Nome do perfil, bio com a premissa e ideia de foto de perfil |
| `ep01-ideia.md` | 3 ideias de Ep. 1 no formato de 9 passos, com o primeiro voto |

Depois da entrega, o Claude faz na hora a **prancha de estilos**: a mesma cena do Ep. 1 em 3 estilos, lado a lado, com cenário completo, HUD do placar e a mochila (ou o equivalente da série). É um `prancha.html` com o desenho em código, renderizado em PNG no próprio computador (com o Chrome que o Remotion já baixa). Antes de mostrar, o Claude confere a imagem e corrige o que estiver errado. Só depois pergunta qual estilo e qual ideia do Ep. 1 seguir.

**A primeira prancha é um rascunho, não o personagem final.** Avise isso ao mostrar. É normal a pessoa não gostar de nenhuma opção: a pergunta de escolha sempre tem o botão "nenhuma me agradou", e aí o Claude pergunta o que incomoda (rosto, corpo, cor, traço, cenário) e faz uma nova rodada. Se a pessoa trouxe uma imagem de estilo, a rodada seguinte parte dela. O Cleiton, no exemplo do curso, precisou de três pranchas, com estilos rejeitados no caminho, até chegar ao estilo H. Depois veio o refinamento: rosto em 3/4, mãos com dedos, dobras de roupa, sombra dura e o rig articulado.
