# Comece aqui

> **Para você, leitor:** não precisa ler este arquivo. Abra o Claude no Code, escolha a pasta onde você colocou estes arquivos (o nome é você quem decide) e escreva só:
>
> **Leia o COMECE-AQUI.md e me guie.**
>
> O resto o Claude conduz com você, passo a passo.

---

## Para o Claude: como conduzir a primeira vez

Esta pessoa comprou o ebook "Série que o público escolhe" e está montando o estúdio pela primeira vez. Ela pode nunca ter usado o Claude nem mexido com programação. Fale em português do Brasil, simples, sem termo técnico, um passo por vez. Use perguntas com botões sempre que a ferramenta estiver disponível.

### O que tem nesta pasta
| Arquivo | Para que serve | Quando é lido |
|---|---|---|
| `CLAUDE.md` | As regras do estúdio | Automaticamente, em toda sessão aberta nesta pasta |
| `COMECE-AQUI.md` | Este roteiro de primeira vez | Só agora, uma vez |
| `entrevista-da-serie.md` | A entrevista que cria a série | Quando a pessoa pedir para criar a série (passo 5) |

Não leia nem execute nada além disso sem a pessoa pedir.

### Passo 1: confirme a pasta
A pasta pode ter qualquer nome (aqui chamada de "pasta do estúdio"): o que importa é a sessão estar aberta **na mesma pasta onde estão o `CLAUDE.md` e este arquivo**. Confira isso.
- Se a sessão estiver numa pasta acima ou ao lado, explique em uma frase por que importa (as regras do `CLAUDE.md` só valem com a sessão aberta nesta pasta) e peça para abrir uma nova sessão nela, dizendo o nome e o caminho da pasta.
- Se você notar regras de outro `CLAUDE.md` valendo (uma pasta acima também tem um), avise: o estúdio funciona melhor numa pasta que não fique dentro de outro projeto.

### Passo 2: veja o que já está instalado
Sem instalar nada ainda, verifique e mostre numa lista curta: Node.js (versão), espaço livre em disco e sistema (Windows ou Mac).

### Passo 3: instale o que falta, com permissão
Para cada item que faltar, diga **o que é, para que serve, o tamanho aproximado e que é gratuito**, e só instale depois de um "sim":
1. **Node.js** (versão LTS), se não houver.
2. **O projeto de vídeo**: crie `projeto/` com um projeto Remotion em branco, 1080×1920, 30 fps. O navegador de render que o Remotion baixa na primeira vez também precisa de aviso.

Se der erro, leia a mensagem, explique em uma linha e tente a correção. Nunca peça para a pessoa digitar comandos sem explicar.

### Passo 4: vídeo de teste
Faça um vídeo de 5 segundos, vertical, fundo colorido com o texto "OLÁ" entrando com uma animação simples. Renderize para `entregas/teste/ola.mp4` e diga onde está para a pessoa abrir. Se abriu, o estúdio está pronto. Comemore em uma linha.

### Passo 5: ofereça o próximo passo
Pergunte com botões:
- "Criar a minha série agora": leia `entrevista-da-serie.md` e siga as instruções dela.
- "Deixar para depois": explique que, quando quiser, basta escrever "Leia entrevista-da-serie.md e me entreviste para criar a minha série".

### Opcional, só se a pessoa pedir
**Legendas automáticas no computador** (transcrição local, gratuita): exige Python e o pacote faster-whisper, com um modelo de cerca de 500 MB. Explique o tamanho e peça permissão antes.

### Regras desta primeira vez
- Avise antes de baixar qualquer coisa, sempre com o tamanho.
- Nada pago, nenhuma conta nova, nenhuma chave de API.
- Ao terminar, não apague nem mova este arquivo.
