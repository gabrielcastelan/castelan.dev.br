# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é este projeto

Site pessoal do Gabriel Marques Castelan (`castelan.dev.br`): uma página só,
estática, em português. Não tem build, dependência, framework, teste nem linter.
Qualquer sugestão de `npm install` ou `npm test` está errada aqui.

| Arquivo | Papel |
|---|---|
| `index.html` | A página inteira. CSS inline no `<head>`, JSON-LD no fim do `<body>`. |
| `foto.webp` / `foto@1x.webp` | Retrato quadrado em 400x400 e 200x200, exibido em círculo pelo CSS. |
| `favicon.svg`, `apple-touch-icon.png` | Monograma do Gabriel. O SVG troca de cor conforme o tema. |
| `robots.txt`, `sitemap.xml`, `llms.txt` | SEO e GEO. Ver abaixo. |
| `CNAME`, `.nojekyll` | Deploy. Ver abaixo. |

## Rodar localmente

```sh
python3 -m http.server 8000   # http://localhost:8000
```

Sem build e sem hot reload: salvar o arquivo e recarregar a página.

## As quatro regras que sustentam o design

Foram decisões explícitas, não acidente. Leia antes de mexer no visual:

1. **Zero JavaScript e zero webfont.** A página não carrega script nem fonte
   externa. Tema escuro, scroll suave e foco de teclado são todos CSS. Se for
   adicionar JS, pergunte antes: a promessa aqui é velocidade.
2. **Uma família tipográfica só: a do sistema operacional de quem visita.**
   O stack começa em `system-ui`, então o site aparece em SF Pro no Mac e no
   iPhone, Segoe no Windows, Roboto no Android. Hierarquia se faz com tamanho e
   peso, nunca trocando de fonte.
3. **Tudo fecha na mesma borda direita.** Régua da seção, coluna de datas,
   retrato e texto corrido terminam todos no mesmo x. É o "esquadro" pedido pelo
   Gabriel. Por isso `.entries` não tem `max-width` própria e o texto leva a
   classe `.justify` (`text-align: justify` + `hyphens: auto`, que depende do
   `lang="pt-BR"` no `<html>`). Se adicionar um parágrafo, ele precisa da classe.
4. **O azul (`--accent`) só aparece em coisa clicável.** Nada decorativo é azul.
   O inverso não vale: títulos de entrada são links e ficam na cor da tinta, com
   sublinhado discreto que vira azul no hover.

O CSS inteiro sai de tokens em `:root`, com o tema escuro sobrescrevendo os
mesmos tokens em `@media (prefers-color-scheme: dark)`. Ao criar uma cor,
defina-a nos dois blocos em vez de cravar um hex na regra. Não existe toggle de
tema: segue o sistema.

**A largura do container é calculada, não escolhida por gosto.** `--col` é
48rem. Tirando a coluna de rótulos (`--label`, 8.5rem) e o vão (`--gap`, 2.5rem),
sobram cerca de 72 caracteres por linha, que é o limite confortável para texto
justificado. Se alargar `--col`, a medida estoura e a justificação abre rios de
espaço entre as palavras.

Dois breakpoints, ambos em `rem`: **54rem** colapsa a coluna de rótulos, e
**34rem** empilha o retrato acima do nome. O retrato é o segundo filho do grid e
sobe com `order: -1`.

## Estrutura do conteúdo

A página é um registro cronológico, não uma landing page de produto. Seções na
ordem: Agora, Comunidade, Ensino, Cultura, Antes, Formação. Cada uma é uma
`<section class="block">` com o rótulo à esquerda e as entradas à direita. Toda
entrada segue a mesma forma:

```html
<article class="entry">
  <div class="entry-top">
    <h3><a href="https://exemplo.com" rel="noopener">Nome</a></h3>
    <time class="when" datetime="2025-09">desde set 2025</time>
  </div>
  <p class="justify"><span class="role">Papel.</span> Descrição.</p>
</article>
```

O `<a>` no `<h3>` é opcional; sem link, o `<h3>` leva o texto direto. O `<time>`
também é opcional (Curitiba Ska Jazz não tem data). O `datetime` é legível por
máquina e alimenta SEO/GEO: mantenha-o correto ao editar a data visível. Use
`class="brief justify"` no `<p>` para entradas curtas, que ficam em cinza.

## Regras de escrita

- **Nada de em-dash (—) nem en-dash (–).** Pedido explícito do Gabriel. Use
  vírgula, ponto, dois-pontos ou reescreva. Intervalo de ano vai com hífen
  (`2023-2027`).
- Números só entram se forem verificáveis (121 inscritos, NPS 9,78, 27 alunos).
  São eles que sustentam a credibilidade e são o que motor de busca com IA cita.
  Não arredonde nem invente.
- Voz ativa, primeira pessoa, frase curta. Sem linguagem promocional.

## SEO e GEO

Três superfícies precisam ser atualizadas **juntas** quando um fato muda, senão
se contradizem:

1. O HTML visível.
2. O `<script type="application/ld+json">` no fim do `index.html` (schema.org
   `ProfilePage` + `Person`, com `worksFor`, `memberOf`, `alumniOf`,
   `knowsAbout`, `sameAs` e o `performerIn` do Startup Weekend).
3. O `llms.txt`, versão em texto puro para mecanismos de resposta por IA lerem e
   citarem. Tem uma seção `## Como citar` no fim com o parágrafo pronto.

O `robots.txt` libera explicitamente os crawlers de IA (GPTBot, ClaudeBot,
PerplexityBot, Google-Extended e outros). É intencional: o objetivo é ser citado.

Pendência conhecida: não existe imagem de Open Graph em 1200x630. O `og:image` é
o retrato quadrado, e por isso `twitter:card` é `summary`, não
`summary_large_image`.

## Deploy

**GitHub Pages**, servindo a branch `main` a partir da raiz, com domínio custom e
HTTPS. Push na `main` publica.

**O arquivo `CNAME` não pode sumir.** Ele contém `castelan.dev.br` e é o que
mantém o domínio custom de pé; sem ele, o próximo build do Pages joga o site de
volta para `gabrielcastelan.github.io`. O GitHub cria esse arquivo sozinho quando
alguém configura o domínio pela interface, o que já gerou um commit remoto que
não existia no clone local. **Sempre `git pull --rebase` antes de dar push neste
repo, e nunca force push.**

O `.nojekyll` desliga o processamento Jekyll, que não serve para nada aqui e só
atrasa o build.

Conferir o build e o site depois do push:

```sh
gh api repos/gabrielcastelan/castelan.dev.br/pages/builds/latest --jq '{status,commit}'
curl -s -o /dev/null -w "%{http_code}\n" https://castelan.dev.br/
```
