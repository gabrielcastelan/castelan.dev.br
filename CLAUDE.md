# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é este projeto

Site pessoal do Gabriel Castelan (`castelan.dev.br`): uma página só, estática, em
português. Não tem build, dependência, framework, teste nem linter. Qualquer
sugestão de `npm install` ou `npm test` está errada aqui.

Arquivos que vão para produção:

| Arquivo | Papel |
|---|---|
| `index.html` | A página inteira. CSS fica inline no `<head>`; o JSON-LD, no fim do `<body>`. |
| `foto.webp` / `foto@1x.webp` | Retrato em 480x720 e 240x360, servidos por `srcset`. |
| `favicon.svg` | Monograma. Provisório, o Gabriel vai mandar o dele. |
| `robots.txt`, `sitemap.xml`, `llms.txt` | SEO e GEO. Ver abaixo. |

## Rodar localmente

```sh
python3 -m http.server 8000   # http://localhost:8000
```

Sem build e sem hot reload: salvar o arquivo e recarregar a página.

## As três regras que sustentam o design

Elas foram decisões explícitas, não acidente. Antes de mexer no visual, leia:

1. **Zero JavaScript e zero webfont.** A página não carrega nenhum script e
   nenhuma fonte externa. Dark mode, scroll suave e foco de teclado são todos
   CSS. Se você for adicionar JS, pergunte antes: a promessa aqui é velocidade.
2. **Uma família tipográfica só: a do sistema operacional de quem visita.**
   O stack começa em `system-ui`, então o site aparece em SF Pro no Mac e no
   iPhone, Segoe no Windows, Roboto no Android. Hierarquia se faz com tamanho e
   peso, nunca trocando de fonte.
3. **O azul (`--accent`) só aparece em coisa clicável.** Nada decorativo é azul.
   Essa restrição é o que mantém a página calma; quebrá-la desmancha o conceito.

O CSS inteiro sai de tokens em `:root`, com o tema escuro sobrescrevendo os
mesmos tokens dentro de `@media (prefers-color-scheme: dark)`. Ao criar uma cor,
defina-a nos dois blocos em vez de cravar um hex na regra. Não existe toggle de
tema: segue o sistema.

Dois breakpoints, ambos em `rem`: **54rem** colapsa a coluna de rótulos das
seções, e **34rem** empilha o retrato acima do nome na abertura. O retrato é o
segundo filho do grid e sobe com `order: -1`.

## Estrutura do conteúdo

A página é um registro cronológico, não uma landing page de produto. Cada bloco é
uma `<section class="block">` com duas colunas: o rótulo (`Agora`, `Comunidade`,
`Ensino`, `Antes`, `Formação`) à esquerda e as entradas à direita. Cada entrada
segue sempre a mesma forma:

```html
<article class="entry">
  <div class="entry-top">
    <h3>Nome</h3>
    <time class="when" datetime="2025-09">desde set 2025</time>
  </div>
  <p><span class="role">Papel.</span> Descrição.</p>
</article>
```

O `datetime` do `<time>` é legível por máquina e alimenta SEO/GEO: mantenha-o
correto quando editar a data visível. Use `class="brief"` no `<p>` para entradas
curtas, que ficam em cinza.

## Regras de escrita

- **Nada de em-dash (—) nem en-dash (–).** Pedido explícito do Gabriel. Use
  vírgula, ponto, dois-pontos ou reescreva a frase. Intervalo de ano vai com
  hífen (`2023-2027`).
- Números só entram se forem verificáveis (121 inscritos, NPS 9,78, 27 alunos).
  São eles que sustentam a credibilidade da página e são o que motor de busca com
  IA cita. Não arredonde nem invente.
- Voz ativa, primeira pessoa, frase curta. Sem linguagem promocional.

## SEO e GEO

Três superfícies precisam ser atualizadas **juntas** quando um fato muda, senão
elas se contradizem:

1. O HTML visível.
2. O `<script type="application/ld+json">` no fim do `index.html` (schema.org
   `ProfilePage` + `Person`, com `worksFor`, `alumniOf`, `knowsAbout`, `sameAs` e
   o `performerIn` do Startup Weekend).
3. O `llms.txt`, que é a versão em texto puro para mecanismos de resposta por IA
   lerem e citarem. Tem uma seção `## Como citar` no fim com o parágrafo pronto.

O `robots.txt` libera explicitamente os crawlers de IA (GPTBot, ClaudeBot,
PerplexityBot, Google-Extended e outros). Isso é intencional: o objetivo é ser
citado, não bloqueado.

Pendências conhecidas de SEO: não existe imagem de Open Graph em 1200x630 (hoje o
`og:image` é o retrato vertical, e por isso `twitter:card` é `summary`, não
`summary_large_image`), e não existe `apple-touch-icon` em PNG.

## Deploy

O repositório não tem configuração de deploy: sem CI, sem script, sem
`vercel.json` ou `netlify.toml`. O remote é
`github.com/gabrielcastelan/castelan.dev.br`. Pergunte ao Gabriel antes de supor
como o site vai ao ar.
